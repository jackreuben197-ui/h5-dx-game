import { componentBox } from '../../ComponentBox.js';
import config from './config.json';
import { element } from '../../dom.js';
import { SpriteAtlas } from '../../SpriteAtlas.js';
import type { TableSettingRow } from '../../../../../logic/GameplayTableSetting.js';

function statusColor(row: TableSettingRow): string {
  if (row.color !== '#7ED27E' && row.color !== '#FF6666') return row.color;
  const enabled = row.enabled ?? (row.color === '#7ED27E');
  const token = enabled ? '--mx-table-setting-positive' : '--mx-table-setting-negative';
  return `var(${token}, ${row.color})`;
}

/** Stable row nodes retain scroll position when bound room data changes. */
export class TableSettingRowView {
  readonly root=componentBox(element('div','mx-room-setting-row'),config);
  private newMark=element('span','mx-room-setting-new','NEW');
  private title=element('span','mx-room-setting-label');
  private value=element('span','mx-room-setting-value');
  private tip=element('button','mx-room-setting-info');
  private detail=element('p','mx-room-setting-detail');
  private description='';
  constructor(showTip:(title:string,description:string)=>void) {
    this.tip.type='button';SpriteAtlas.paintWarning(this.tip, config.paths.infoTip);
    this.tip.onclick=()=>showTip(this.title.textContent??'',this.description);
    const heading=element('div','mx-room-setting-heading');heading.append(this.title,this.newMark,this.tip);
    this.root.append(heading,this.value,this.detail);
  }
  update(row:TableSettingRow):void {
    this.root.dataset.id=row.id;
    this.newMark.hidden=!row.isNew;
    if(this.title.textContent!==row.title)this.title.textContent=row.title;
    if(this.value.textContent!==row.value)this.value.textContent=row.value;
    this.value.style.color=statusColor(row);
    this.tip.hidden=!row.tips;this.description=row.tips??'';this.tip.setAttribute('aria-label',row.title);
    this.detail.hidden=!row.detail; if(this.detail.textContent!==(row.detail??''))this.detail.textContent=row.detail??'';
  }
}
