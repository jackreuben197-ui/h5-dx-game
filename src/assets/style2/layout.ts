import { LayoutOriginal } from '../style1/table/layouts/LayoutOriginal.js';
import { tableLayouts } from '../style1/table/layouts/TableLayoutProfile.js';
import type { TableLayoutId } from '../../data/TexasGamePersonalSettings.js';
import type { TableSnapshot } from '../../core/types.js';
import type { LayoutContent, LayoutContentOptions, SeatPlacement } from '../../ui/TableLayout.js';
/** Picnic geometry uses 440-wide design coordinates. Never mutates table data. */
export class PicnicLayout extends LayoutOriginal {
  override readonly id: TableLayoutId;
  constructor(id:TableLayoutId) {super();this.id=id;}
  override get compactRoomInfo(){return true;}
  override resize(w:number,h:number,landscape:boolean,bottom=h-76){
    super.resize(w,h,landscape,bottom);
    if(landscape)return;
    this.unit=w/1440;this.width=1440;this.height=h/this.unit;
    this.menuScale=1;this.suggest=Math.min(1,this.designHeight/782);
    this.origin={x:720,y:this.height*.43};
  }
  private get k(){return 1440/440;}
  private get designUnit(){return this.unit*this.k;}
  private get designHeight(){return this.height/this.k;}
  private get bottom(){return this.viewportBottom/this.designUnit;}
  private get compact(){return this.viewportHeight<734;}
  private get scrollShort(){return this.viewportHeight<434;}
  private get heroY(){return this.compact?(this.viewportBottom+(this.scrollShort?190:0)-145)/this.designUnit:this.bottom-120-64/this.designUnit;}
  override positions(state:TableSnapshot):Map<number,SeatPlacement>{
    if(this.landscape){
      const positions=super.positions(state);
      // The two-line picnic identity is taller than the original; keep top bets beside it.
      for(const p of positions.values())if(p.edge==='top')p.betX=290;
      return positions;
    }
    const positions=new Map<number,SeatPlacement>();
    const anchors=tableLayouts[this.id==='original'?'balanced':this.id].anchors[state.seatCount]!;
    const compact=Math.min(1,Math.max(.68,(this.heroY-75)/390));
    const scale=54/199*compact;
    for(let id=1;id<=state.seatCount;id++){
      const slot=(id-(state.mySeat||1)+state.seatCount)%state.seatCount;
      const [ax,ay]=anchors[slot]!;
      const ref=this.id==='classic'?{top:98,bottom:517}:{top:154,bottom:432};
      const top=slot!==0&&ax>100&&ax<340;
      const x=slot===0?146:top?220+(ax-220)*1.3:ax<220?50:390;
      const sideTop=150,sideBottom=Math.max(420,this.heroY-105);
      const y=slot===0?this.heroY:top?92:sideTop+(ay-ref.top-60)/(ref.bottom-ref.top-60)*(sideBottom-sideTop);
      const mine=id===state.mySeat;
      const revealed=state.players.find(p=>p.seat===id)?.cards.some(c=>c>0);
      positions.set(id,{x,y,scale,edge:slot===0?'bottom':top?'top':ax<220?'left':'right',
        cardsX:mine?80/scale:revealed?0:(ax<220?58:-28)/scale,
        cardsY:mine?0:revealed?0:6/scale,
        cardScale:mine?38/(120*scale):revealed?.65:18/(65*scale),
        handSpread:mine?246:270,backHandSpread:56,
        betX:mine?154/scale:0,betY:mine?16/scale:78/scale,
        betIconX:-25,dealerX:mine?144/scale:-32/scale,dealerY:mine?-12/scale:0,
      });
    }
    if(this.compact){
      const sideIds=[...positions.keys()].filter(id=>!['top','bottom'].includes(positions.get(id)!.edge));
      for(const id of positions.keys()){
        const p=positions.get(id)!;const mine=id===state.mySeat;const bottom=p.edge==='bottom';
        p.scale=34/(199*this.designUnit);
        if(bottom){p.x=118/this.designUnit;p.y=this.heroY;}
        else if(p.edge==='top'){p.x-=26/this.designUnit;p.y=64/this.designUnit;}
        else {const peers=sideIds.filter(i=>positions.get(i)!.edge===p.edge).sort((a,b)=>positions.get(a)!.y-positions.get(b)!.y);p.y=(113+peers.indexOf(id)*(48+Math.max(0,this.heroY*this.designUnit-196)/2))/this.designUnit;p.x=(p.edge==='left'?24:this.width*this.unit-24)/this.designUnit;}
        const actualScale=p.scale*this.designUnit;
        p.betY=(bottom?14:p.edge==='top'?20:23)/actualScale;p.betX=bottom?110/actualScale:p.edge==='top'?(p.x*this.designUnit<this.width*this.unit/2?-22:72)/actualScale:0;
        if(mine){p.cardsY=12/actualScale;p.cardsX=57/actualScale;p.cardScale=29/(120*actualScale);p.dealerX=104/actualScale;p.dealerY=-14/actualScale;}
        else if(!state.players.find(player=>player.seat===id)?.cards.some(c=>c>0)){p.cardsX=(p.edge==='right'?-24:24)/actualScale;p.cardsY=-13/actualScale;p.cardScale=10/(65*actualScale);}
      }
    }
    // A spectator still sees a player in the bottom slot. Place that bet above the avatar.
    if (!state.mySeat) {
      const bottomSeat = positions.get(1);
      if (bottomSeat) {
        bottomSeat.betX = 0;
        bottomSeat.betY = -190;
      }
    }
    for(const p of positions.values()){
      p.microphoneSide=p.x<220?'left':'right';
      p.x*=this.k;p.y*=this.k;p.scale*=this.k;}
    return positions;
  }
  override content(o:LayoutContentOptions):LayoutContent{
    if(this.landscape){
      const content=super.content(o);
      const poolY=content.board.y-88*(content.board.scale??1)-26/this.unit;
      return {...content,pool:{...content.pool,y:poolY},total:{...content.total,y:poolY-26/this.unit},
        styles:{...content.styles,'--dx-bottom':`${this.viewportHeight-6}px`,'--dx-unit':String(this.unit)}};
    }
    const boardY=this.compact?165/this.designUnit:Math.max(310,this.heroY*.58);
    const scale=(this.compact?25/this.designUnit:36)/120*o.boardSize;
    const gap=this.id==='classic'?88*scale:60*o.boardSize;
    // First board keeps its anchor when a second run appears. Information starts below the last card.
    const infoY=boardY+(o.dual?gap:0)+88*scale+(this.compact?8/this.designUnit:12);
    const line=this.compact?12:13,padding=this.compact?8:10;
    const available=this.heroY*this.designUnit-(this.compact?17:27*this.designUnit)-8-infoY*this.designUnit;
    const infoHeight=Math.max(1,Math.floor((available-padding)/line))*line+padding;
    const joinInfoHeight=Math.max(1,Math.floor((available-padding-52)/line))*line+padding;
    return {board:{x:720,y:boardY*this.k,scale:scale*this.k},secondBoard:{x:720,y:(boardY+gap)*this.k,scale:scale*this.k},
      total:{x:720,y:(this.compact?102/this.designUnit:boardY-112)*this.k},pool:{x:720,y:(this.compact?115/this.designUnit:boardY-80)*this.k},info:{x:720,y:infoY*this.k},
      styles:{'--dx-info-top':`${infoY*this.designUnit}px`,'--dx-info-join-height':`${joinInfoHeight/this.unit}px`,'--dx-info-height':`${infoHeight/this.unit}px`,'--dx-info-width':`${Math.max(130,Math.min(220,this.width*this.unit-180))/this.unit}px`,'--dx-info-line':`${line/this.unit}px`,'--dx-info-font':`${(this.compact?10:11)/this.unit}px`,'--dx-info-padding':`${padding/2/this.unit}px`,'--dx-unit':String(this.unit),'--dx-scroll-height':`${this.heroY*this.designUnit+70}px`,'--dx-hero-y':`${this.heroY*this.designUnit}px`,'--dx-bottom':`${this.viewportBottom}px`,
        '--mx-classic-seat-unit':`${199/54}px`,'--mx-hero-card-height':'176px','--mx-ring-hand-type-y':`${43*199/54}px`,
        '--mx-ring-hand-type-x':`${80*199/54}px`,'--mx-hero-info-y':`${40*199/54}px`,
        '--mx-side-add-center-y':`${this.heroY*this.designUnit}px`,'--mx-side-watch-center-y':`${(this.heroY-45)*this.designUnit}px`,
        '--mx-jackpot-y':'52px','--mx-calltime-y':'72px'},};
  }
  override controls(state:TableSnapshot,size:number){
    if(this.landscape)return super.controls(state,size);
    return {scale:.35*size,styles:{left:'8px',right:'8px',top:`${this.viewportBottom-(this.compact?48:60*this.designUnit)}px`,
      '--mx-operation-row-y':`${this.viewportBottom-(this.compact?48:60*this.designUnit)}px`,'--dx-action-scale':String(size),
      '--mx-op-upper-y':'0px','--mx-op-fold-x':'0px','--mx-op-main-x':'0px'}};
  }
}
