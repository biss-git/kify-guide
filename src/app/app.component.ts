import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KifuService } from './service/kifu.service';

declare function gunzip(compressed: Uint8Array): Uint8Array;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private kifuService: KifuService,
    ){}

  kifu: string;

  root: string = 'https://kify.rei-yumesaki.net/';

  chromeExtensionAddress = 'https://chrome.google.com/webstore/detail/%E6%A3%8B%E8%AD%9C%E8%AA%AD%E3%81%BF%E3%81%A1%E3%82%83%E3%82%93%E6%A3%8B%E8%AD%9C%E5%85%B1%E6%9C%89/akijciiemppimilfbdbbnjlgffbbibal?hl=ja&authuser=0';

  selectedItem: number = null;

  setNumber: string; // 設定番号
  voiceNumber: string; // 読み上げ音声
  komaotoNumber: string; // 駒の音
  playSpeedNumber: string;
  //commentNumber: string;
  backNumber: string;
  senteIconNumber: string;
  goteIconNumber: string;
  komaNumber: string;
  banNumber: string;
  //masuNumber: string;
  komadaiNumber: string;
  mochiNumber: string;
  markerNumber: string;
  playButtonNumber: string;
  //addMilliSecNumber: string;
  selectionNumber: string;
  logoNumber: string;


  ngOnInit() {
    this.SetEvent();
    this.getParam();
    // 本当は unsubscribe 書いたほうがいいけどページ１つしかないので
    this.activatedRoute.queryParams.subscribe(
      // http://localhost:4200/#/?id=abcId というurl でアクセスした場合に id = abcId というのがもらえる
      params => {
        if (params.id){
          console.log(params.id);
        }
        let position = '';
        if (params.s){
          // 初期局面　平手なら必要なし
          // sfen だが、　space は _ 、 + は * 、 / は $ にそれぞれ置き換えてあるので注意
          console.log(params.s);
          const sfens = params.s.split('_');
          if(sfens.length >= 3){
            const lines: string[] = sfens[0].split('\$');
            if(lines.length == 9){
              position = this.kifuService.ki2GoteMochi(sfens[2]) + '\n' +
                         this.kifuService.ki2Ban(lines) + '\n' +
                         this.kifuService.ki2SenteMochi(sfens[2]);
            }
          }
        }

        let buffer = null;
        if (params.m){
          // 16bitの指し手を文字列にして渡してきたやつ urlだと + が space に置き換わってしまうので直す
          const move = params.m.replace(/ /g, '+')
          console.log(move);
          // base 64 なので byteArray に直して gzip を解凍
          let binary = atob(move);
          let len = binary.length;
          let compressed = new Uint8Array(len);
          for (let i = 0; i < len; i++)        {
            compressed[i] = binary.charCodeAt(i);
          }
          buffer = gunzip(compressed);
          console.log(buffer);
        }

        if(buffer || position){
          // もともとの byteArray (１手24bit) から棋譜(ki2)を復元する
          this.kifu = this.kifuService.bytesToKifu(buffer, position);
          localStorage.setItem('kifu', this.kifu);
        }
      },
    );
  }

  active = true;

  SetEvent(): void{
    window.addEventListener("blur", () => {
      console.log("ページからフォーカスが外れた");
      this.active = false;
    });
  }

  /**
   * ページ遷移が行われなかったときに拡張機能のインストいーるを促す
   */
  buttonEvent(): void{
    console.log(location.hostname);
    open("https://kify.rei-yumesaki.net/input.html", '_blank');

    // if(location.hostname == "localhost" || location.hostname == "kify.rei-yumesaki.net"){
    //     open("https://kify.rei-yumesaki.net/input.html", '_blank');
    // }
    // else
    // {
    //   this.active = true;
    //   setTimeout(() => {
    //     if(this.active){
    //       if(confirm('棋譜読みちゃん棋譜共有拡張機能が必要です。インストールページへ移動しますか？')){
    //         open(this.chromeExtensionAddress, '_blank');
    //       }
    //     }
    //   }, 500);
    // }
  }


  getParam(){
    this.kifu = localStorage.getItem('kifu');
    if(this.kifu == 'null'){ this.kifu = '';}

    this.setNumber = localStorage.getItem("kify_setting_now_set_number");
    if(this.setNumber == null){
      this.setNumber = '1';
      localStorage.setItem("kify_setting_now_set_number", this.setNumber);
    }
    this.voiceNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_1");
    this.komaotoNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_2");
    this.playSpeedNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_3");
    //this.commentNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_4");
    this.backNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_5");
    this.senteIconNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_6");
    this.goteIconNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_7");
    this.komaNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_8");
    this.banNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_9");
    //this.masuNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_10");
    this.komadaiNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_11");
    this.mochiNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_12");
    this.markerNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_13");
    this.playButtonNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_14");
    //this.addMilliSecNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_15");
    this.selectionNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_16");
    this.logoNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_17");
    if(this.voiceNumber == null){ this.voiceNumber = '1';}
    if(this.komaotoNumber == null){ this.komaotoNumber = '1';}
    if(this.playSpeedNumber == null){ this.playSpeedNumber = '0.5';}
    //if(this.commentNumber == null){ this.commentNumber = '1';}
    if(this.backNumber == null){ this.backNumber = '1';}
    if(this.senteIconNumber == null){ this.senteIconNumber = '1';}
    if(this.goteIconNumber == null){ this.goteIconNumber = '1';}
    if(this.komaNumber == null){ this.komaNumber = '1';}
    if(this.banNumber == null){ this.banNumber = '1';}
    //if(this.masuNumber == null){ this.masuNumber = '1';}
    if(this.komadaiNumber == null){ this.komadaiNumber = '1';}
    if(this.mochiNumber == null){ this.mochiNumber = '1';}
    if(this.markerNumber == null){ this.markerNumber = '1';}
    if(this.playButtonNumber == null){ this.playButtonNumber = '1';}
    //if(this.addMilliSecNumber == null){ this.addMilliSecNumber = '0';}
    if(this.selectionNumber == null){ this.selectionNumber = '1';}
    if(this.logoNumber == null){ this.logoNumber = '1';}

    console.log(this.backNumber);
  }

  setSettingNumber(): void{
    localStorage.setItem("kify_setting_now_set_number", this.setNumber);
    localStorage.setItem('kifu', this.kifu);
    this.getParam();
  }
  setSettings(): void{
    localStorage.setItem('kifu', this.kifu);

    localStorage.setItem("kify_setting_" + this.setNumber + "_1", this.voiceNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_2", this.komaotoNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_3", this.playSpeedNumber);
    // localStorage.setItem("kify_setting_" + this.setNumber + "_4", this.commentNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_5", this.backNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_6", this.senteIconNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_7", this.goteIconNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_8", this.komaNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_9", this.banNumber);
    // localStorage.setItem("kify_setting_" + this.setNumber + "_10", this.masuNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_11", this.komadaiNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_12", this.mochiNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_13", this.markerNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_14", this.playButtonNumber);
    // localStorage.setItem("kify_setting_" + this.setNumber + "_15", this.addMilliSecNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_16", this.selectionNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_17", this.logoNumber);
  }
  selectItem(num: number): void{
    console.log(num);
    this.selectedItem = num;
  }

  testPlayVoice(): void{
    const audioElem = new Audio();
    audioElem.src = this.root + "sound/yomiage_" + this.voiceNumber + "/302.wav";
    audioElem.play();
  }
  testPlayKomaoto(): void{
    const audioElem = new Audio();
    audioElem.src = this.root + "sound/komaoto_" + this.komaotoNumber + "/komaoto.wav";
    audioElem.play();
  }


  backDefault(): void {
    localStorage.setItem('kifu', this.kifu);
    if(window.confirm('設定番号'+this.setNumber+'をデフォルトに戻しますか？')){ // 確認ダイアログを表示
      for(var i=1; i<=17; i++) {
        localStorage.setItem("kify_setting_" + this.setNumber + "_" + i, '1');
      }
      localStorage.setItem("kify_setting_" + this.setNumber + "_3", '0.5');
      localStorage.setItem("kify_setting_" + this.setNumber + "_15", '0');

      document.getElementById("message").textContent = '設定番号' + this.setNumber + ' をデフォルトに戻しました。';
      this.getParam();
    } else {
      // window.alert('キャンセルしました。'); // 警告ダイアログを表示
    }
  }

  selectGraphicItem(key: number, itemNumber: number): void{
    console.log(key, itemNumber);
    localStorage.setItem("kify_setting_" + this.setNumber + "_" + key, itemNumber.toString());
    this.getParam();
  }

}
