export interface Packet {
  code: number;
  roomID: number;
  matchID: number;
  body: Uint8Array;
}
/**
 * Hold'em WebSocket packet header shared with the current H5 bridge.
 *
 * Outbound packets include the four-byte data-length prefix (59 bytes before
 * the protobuf body); inbound packets forwarded by H5 omit that prefix (55
 * bytes before the protobuf body). The old YM/57-byte format is no longer
 * compatible with the H5 bridge.
 */
export class PacketCodec {
  encode(
    code: number,
    token: string,
    roomID: number,
    matchID: number,
    body: Uint8Array,
  ): Uint8Array {
    if (!token || token.length > 32 || !/^[\x20-\x7e]+$/.test(token))
      throw new Error('登录凭据无效，请重新登录');
    const result = new Uint8Array(59 + body.byteLength),
      view = new DataView(result.buffer);
    view.setUint32(0, result.length - 4);
    view.setUint16(4, code);
    result.set([0x42, 0x51, 0x4d, 0x4e], 6); // BQMN
    result.set(new TextEncoder().encode(token), 10);
    this.writeID(view, 42, roomID);
    this.writeID(view, 50, matchID);
    result[58] = 2;
    result.set(body, 59);
    return result;
  }
  decode(input: ArrayBuffer | ArrayBufferView): Packet {
    const bytes =
      input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    if (
      bytes.length < 55 ||
      bytes[2] !== 0x42 ||
      bytes[3] !== 0x51 ||
      bytes[4] !== 0x4d ||
      bytes[5] !== 0x4e ||
      bytes[54] !== 2
    )
      throw new Error('房间协议包头无效');
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return {
      code: view.getUint16(0),
      roomID: this.readID(view, 38),
      matchID: this.readID(view, 46),
      body: bytes.slice(55),
    };
  }
  private writeID(view: DataView, offset: number, value: number): void {
    if (!Number.isSafeInteger(value) || value < 0) throw new Error('房间标识超出安全整数范围');
    view.setBigUint64(offset, BigInt(value));
  }
  private readID(view: DataView, offset: number): number {
    const value = view.getBigUint64(offset);
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('房间标识超出安全整数范围');
    return Number(value);
  }
}
