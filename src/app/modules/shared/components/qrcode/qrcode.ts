import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {qrcanvas} from 'qrcanvas';

@Component({
  selector: 'ion-qrcode',
  templateUrl: 'qrcode.html'
})
export class QrCodeComponent implements AfterViewInit, OnChanges {
  options: any;
  effects = ['none', 'liquid', 'round', 'spot'];
  @Input() size: string;
  @Input() data: string;
  @Input() logo: string;
  @Input() background: string;
  @Input() foreground: string;
  @Input() colorOut: string;
  @Input() colorIn: string;
  @Input() level: string;
  @Output() qrCanvas = new EventEmitter();

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    // this.generateQrCode();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('background' in changes ||
      'backgroundAlpha' in changes ||
      'foreground' in changes ||
      'foregroundAlpha' in changes ||
      'colorOut' in changes ||
      'colorIn' in changes ||
      'level' in changes ||
      'mime' in changes ||
      'padding' in changes ||
      'size' in changes ||
      'data' in changes ||
      'logo' in changes ||
      'canvas' in changes) {
      this.generateQrCode();
    }
  }

  generateQrCode() {
    const innerHTML = '';
    this.elementRef.nativeElement.querySelector('#qrcode').innerHTML = innerHTML;
    // document.getElementById('qrcode').innerText = '';
    const colorFore = this.foreground;
    const colorOut = this.colorOut;
    const colorIn = this.colorIn;
    this.options = {
      cellSize: 8,
      size: this.size,
      correctLevel: 'H',
      data: this.data,
      // logo: {
      //   image: image,
      //   size: 10 / 100,
      // },
      foreground: [
        // foreground color
        {style: colorFore},
        // outer squares of the positioner
        {row: 0, rows: 4, col: 0, cols: 4, style: colorOut},
        {row: -4, rows: 4, col: 0, cols: 4, style: colorOut},
        {row: 0, rows: 4, col: -4, cols: 4, style: colorOut},
        // inner squares of the positioner
        {row: 1, rows: 2, col: 1, cols: 2, style: colorIn},
        {row: -3, rows: 2, col: 1, cols: 2, style: colorIn},
        {row: 1, rows: 2, col: -3, cols: 2, style: colorIn},
      ],
      background: 'white',
      effect: {
        key: 'none',
        value: 1,
      }
    };
    // this.options.effect.key = this.effects[Math.floor(Math.random() * this.effects.length)];
    // console.log(this.options)
    if (this.logo) {
      const image = new Image();
      image.src = this.logo;
      this.options.logo = {
        image,
        size: 10 / 100
      };

      image.onload = () => {
        const canvas = qrcanvas(this.options);
          const dataURL = canvas.toDataURL();
          this.qrCanvas.emit(dataURL);
        // document.getElementById('qrcode').appendChild(canvas);
        this.elementRef.nativeElement.querySelector('#qrcode').appendChild(canvas);
      };
    } else {
      const canvas = qrcanvas(this.options);
        const dataURL = canvas.toDataURL();
        this.qrCanvas.emit(dataURL);
      // document.getElementById('qrcode').appendChild(canvas);
      this.elementRef.nativeElement.querySelector('#qrcode').appendChild(canvas);
    }
  }
}
