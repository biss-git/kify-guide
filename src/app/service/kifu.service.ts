import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KifuService {

  constructor() { }


  kansuuji(num: number): string{
    switch(num){
      case 1: return '一';
      case 2: return '二';
      case 3: return '三';
      case 4: return '四';
      case 5: return '五';
      case 6: return '六';
      case 7: return '七';
      case 8: return '八';
      case 9: return '九';
      case 10: return '十';
      case 11: return '十一';
      case 12: return '十二';
      case 13: return '十三';
      case 14: return '十四';
      case 15: return '十五';
      case 16: return '十六';
      case 17: return '十七';
      case 18: return '十八';
    }
    return null;
  }

  // 歩の持ち駒18までしかあり得ないので、こうしておく
  numberOfChar(c: string): number{
    switch(c){
      case '1': return 1;
      case '2': return 2;
      case '3': return 3;
      case '4': return 4;
      case '5': return 5;
      case '6': return 6;
      case '7': return 7;
      case '8': return 8;
      case '9': return 9;
      case '10': return 10;
      case '11': return 11;
      case '12': return 12;
      case '13': return 13;
      case '14': return 14;
      case '15': return 15;
      case '16': return 16;
      case '17': return 17;
      case '18': return 18;
    }
    return null;
  }
  // p を 歩 のように変換する
  goteCharConvert(c: string){
    switch(c){
      case 'p': return '歩';
      case 'l': return '香';
      case 'n': return '桂';
      case 's': return '銀';
      case 'g': return '金';
      case 'b': return '角';
      case 'r': return '飛';
      case 'k': return '玉';
      case '*p': return 'と';
      case '*l': return '杏';
      case '*n': return '圭';
      case '*s': return '全';
      case '*b': return '馬';
      case '*r': return '龍';
    }
    return null;
  }
  senteCharConvert(c: string){
    switch(c){
      case 'P': return '歩';
      case 'L': return '香';
      case 'N': return '桂';
      case 'S': return '銀';
      case 'G': return '金';
      case 'B': return '角';
      case 'R': return '飛';
      case 'K': return '玉';
      case '*P': return 'と';
      case '*L': return '杏';
      case '*N': return '圭';
      case '*S': return '全';
      case '*B': return '馬';
      case '*R': return '龍';
    }
    return null;
  }

  ki2GoteMochi(sfen2: string): string{
    let mochi = '';

    let all = sfen2;
    while(all.length > 0){
      let s = all.slice(0,1);
      const char = this.goteCharConvert(s);
      if(char){
        let s2 = this.numberOfChar(all.slice(1,3));
        let s1 = this.numberOfChar(all.slice(1,2));
        if(s2){
          mochi += char + this.kansuuji(s2) + '　';
          all = all.slice(3);
        }
        else if(s1){
          mochi += char + this.kansuuji(s1) + '　';
          all = all.slice(2);
        }
        else{
          mochi += char + '　';
          all = all.slice(1);
        }
      }
      else{
        all = all.slice(1);
      }
    }

    if(mochi == ''){
      mochi = 'なし';
    }
    return '後手の持駒：' + mochi;
  }
  ki2SenteMochi(sfen2: string): string{
    let mochi = ''

    let all = sfen2;
    while(all.length > 0){
      let s = all.slice(0,1);
      const char = this.senteCharConvert(s);
      if(char){
        let s2 = this.numberOfChar(all.slice(1,3));
        let s1 = this.numberOfChar(all.slice(1,2));
        if(s2){
          mochi += char + this.kansuuji(s2) + '　';
          all = all.slice(3);
        }
        else if(s1){
          mochi += char + this.kansuuji(s1) + '　';
          all = all.slice(2);
        }
        else{
          mochi += char + '　';
          all = all.slice(1);
        }
      }
      else{
        all = all.slice(1);
      }
    }

    if(mochi == ''){
      mochi = 'なし';
    }
    return '先手の持駒：' + mochi;
  }
  ki2Ban(lines: string[]): string{
    let ban = '  ９ ８ ７ ６ ５ ４ ３ ２ １\n'
    ban += '+---------------------------+\n';
    console.log(lines);
    for(let i =0; i<9; i++){
      // |v杏v圭v全v金v玉v金 ・ ・ ・|一
      let rank: string = '|';
      let line: string = lines[i];
      console.log(line);
      while(line.length > 0){
        let s = line.slice(0,1);
        if(s == '*'){
          let s = line.slice(0,2);
          if(this.senteCharConvert(s)){
            rank += ' ' + this.senteCharConvert(s);
          }
          else if(this.goteCharConvert(s)){
            rank += 'v' + this.goteCharConvert(s);
          }
          line = line.slice(2);
        }
        else{
          if(this.senteCharConvert(s)){
            rank += ' ' + this.senteCharConvert(s);
          }
          else if(this.goteCharConvert(s)){
            rank += 'v' + this.goteCharConvert(s);
          }
          else if(this.numberOfChar(s)){
            const JJ = this.numberOfChar(s);
            for(let j=0; j<JJ; j++){
              rank += ' ' + '・';
            }
          }
          line = line.slice(1);
        }
      }
      rank += '|' + this.kansuuji(i);
      ban += rank + '\n';
    }


    ban += '+---------------------------+';
    return ban;
  }

  bytesToKifu(bytes: Uint8Array, position): string{

    let ki2 : string = '場所：棋譜読みちゃん https://kify.rei-yumesaki.net/' + "\n";
    if(position){
      ki2 += position + "\n";
    }
    ki2 += '先手：▲先手\n';
    ki2 += '後手：△後手\n';

    if(bytes){
      const moveLength = bytes.length / 3;
      let isSente: boolean = true;

      for(var i = 0; i<moveLength; i++){
        if(isSente){
          ki2 += '▲'
        }
        else{
          ki2 += '△'
        }
        const move: string = this.moveFromBytes(bytes[i + 0 * moveLength], bytes[i + 1 * moveLength], bytes[i + 2 * moveLength]);
        console.log(i, bytes[i + 0 * moveLength], bytes[i + 1 * moveLength], bytes[i + 2 * moveLength], move);
        ki2 += move;
        if((i + 1) % 10 == 0){
          ki2 += '\n'
        }
        else{
          ki2 += ' '
        }
        isSente = !isSente;
      }
    }
    else{
      ki2 += '▲投了';
    }

    return ki2;
  }

  private moveFromBytes(to: number, koma: number, posi: number): string{
    if(to == 0 && koma == 0 && posi == 0){
      return '投了';
    }
    return this.moveFromByte(to) + this.komaFromByte(koma) + this.posiFromByte(posi);
  }

  private moveFromByte(to: number): string{
    if(to == 255){
      return "同　";
    }
    to -= 1;
    let rank = to % 9; // 段
    let file = (to-rank) / 9 // 筋
    rank += 1;
    file += 1;
    let move: string = '';
    switch(file){
      case 1: move+='１'; break;
      case 2: move+='２'; break;
      case 3: move+='３'; break;
      case 4: move+='４'; break;
      case 5: move+='５'; break;
      case 6: move+='６'; break;
      case 7: move+='７'; break;
      case 8: move+='８'; break;
      case 9: move+='９'; break;
    }
    switch(rank){
      case 1: move+='一'; break;
      case 2: move+='二'; break;
      case 3: move+='三'; break;
      case 4: move+='四'; break;
      case 5: move+='五'; break;
      case 6: move+='六'; break;
      case 7: move+='七'; break;
      case 8: move+='八'; break;
      case 9: move+='九'; break;
    }
    return move;
  }

  private komaFromByte(koma: number): string{
    switch(koma){
      case 0: return '歩';
      case 1: return '香';
      case 2: return '桂';
      case 3: return '銀';
      case 4: return '角';
      case 5: return '飛';
      case 6: return '金';
      case 7: return '玉';
      case 8: return 'と';
      case 9: return '成香';
      case 10: return '成桂';
      case 11: return '成銀';
      case 12: return '馬';
      case 13: return '龍';
    }
  }

  private posiFromByte(posi: number): string{
    const lr = posi % 4;
    posi = (posi - lr) / 4;
    const tb = posi % 4;
    posi = (posi - tb) / 4;
    const pr = posi % 4;
    let move: string = '';
    switch(lr){
      case 1: move += '右'; break;
      case 2: move += '左'; break;
    }
    switch(tb){
      case 1: move += '上'; break;
      case 2: move += '寄'; break;
      case 3: move += '引'; break;
    }
    switch(pr){
      case 1: move += '不成'; break;
      case 2: move += '成'; break;
      case 3: move += '打'; break;
    }
    return move;
  }

}
