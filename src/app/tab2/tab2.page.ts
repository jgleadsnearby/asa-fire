import {Component, ViewChild} from '@angular/core';
import {Platform, AlertController, ToastController} from '@ionic/angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import QRCode from 'qrcode';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {Capacitor, FilesystemDirectory, Plugins} from '@capacitor/core';

const { Filesystem } = Plugins;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    @ViewChild('showModel') showModel: any;
    encodeData: any;
    scannedData: {};
    barcodeScannerOptions: BarcodeScannerOptions;
    pdfObj = null;
    docDefinition: any;
    code = 'https://app.servicetrade.com/customer/';
    generated = '';
    isCreate = false;

    displayQrCode() {
        return this.generated !== '';
    }


    constructor(
        private socialSharing: SocialSharing,
        private barcodeScanner: BarcodeScanner,
        private fileOpener: FileOpener,
        private plt: Platform,
        public alertController: AlertController,
        public toastCtrl: ToastController
    ) {
        // Options
        this.barcodeScannerOptions = {
            showTorchButton: true,
            showFlipCameraButton: true
        };
        // this.isCreate = false;
    }

    /*generatorQR() {
        this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.code).then((encodedData) => {
            alert('Barcode create ' + JSON.stringify(encodedData));
            this.generated = encodedData;
            console.log('vip_ ', this.generated);
        }, (err) => {
            console.log('Error occured : ' + err);
        });
    }*/

    process() {
        this.isCreate = true;
        // const qrcode = QRCode;
        // const self = this;
        // qrcode.toDataURL(self.code, { errorCorrectionLevel: 'H' }, function (err, url) {
        //     self.generated = url;
        // });
    }

    // Share via email
    shareMail() {
        this.socialSharing.shareViaEmail('', 'QR Code', ['recipient@example.org'], [''] , [''], this.generated).then(() => {
            // Success!
        }).catch(() => {
            // Error!
        });
    }

    createPdf() {
        // console.log('create pdf start')
        this.docDefinition = {
            content: [
                { text: 'QR Code', style: 'header' },
                // { text: new Date().toTimeString(), alignment: 'right' },

                // { text: 'From', style: 'subheader' },
                // { text: 'vipul from' },
                //
                // { text: 'To', style: 'subheader' },
                // { text: 'vipul to' },

                { image: this.generated, style: 'story', margin: [0, 20, 0, 20] },

                // {
                //     ul: [
                //         'Bacon',
                //         'Rips',
                //         'BBQ',
                //     ]
                // }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 15, 0, 0]
                },
                story: {
                    italic: true,
                    alignment: 'center',
                    width: '100%',
                }
            }
        };
        // console.log('create pdf', this.docDefinition);
        this.pdfObj = pdfMake.createPdf(this.docDefinition);
        // console.log('create pdf end');
        this.downloadPdf();
    }

    async print() {
        const alert = await this.alertController.create({
            header: 'Print QR Code',
            inputs: [
                {
                    name: 'host',
                    placeholder: 'Host IP',
                    type: 'text'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Connect & Print',
                    handler: (result) => {
                        this.processPrint(result);
                    }
                }
            ],
            backdropDismiss: false,
        });
        await alert.present();
    }

    processPrint = async (result) => {
        const {ASAPrintPlugin} = Capacitor.Plugins;
        try {
            const data = await ASAPrintPlugin.print({'host': null, image: this.generated});
            console.log('plugin response >>', data);
        } catch (e) {
            console.log(e.toString());
        }
    };

    downloadPdf() {
        if (this.plt.is('cordova')) {
            this.pdfObj.getBuffer((buffer) => {
                const blob = new Blob([buffer], { type: 'application/pdf' });
                this.fileWrite(blob);
            });
        } else {
            // On a browser simply use download!
            this.pdfObj.download();
        }
    }

    fileWrite(blob) {
        try {
            const reader = new FileReader;
            reader.onload = () => {
                const result = reader.result as string;
                console.log('file result >>', result);
                console.log('file dir', FilesystemDirectory.Documents);
                Filesystem.writeFile({
                    data: result,
                    directory: FilesystemDirectory.Documents,
                    path: 'asa-qr-code.pdf',
                }).then(async (data) => {
                    console.log('file written successfully!', data);
                    const uriResult = await Filesystem.getUri({
                        directory: FilesystemDirectory.Documents,
                        path: 'asa-qr-code.pdf',
                    });
                    console.log('uri data imp >>', uriResult);
                    this.fileOpener.open(uriResult.uri, 'application/pdf');
                }).catch((e) => {
                    console.log('file error >>', e);
                });
            };

            reader.readAsDataURL(blob);
        } catch (e) {
            console.error('Unable to write file', e);
        }
    }

    setQrCanvas (data) {
        // console.log('canvas >>>>>', data);
        this.generated = data;
    }

    async presentAlertPrompt() {
        const alert = await this.alertController.create({
            header: 'QR Code Scanner',
            inputs: [
                {
                    name: 'password',
                    placeholder: 'Password',
                    type: 'password'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        console.log('Confirm Ok');
                        if ('qr123' === data.password) {
                            this.process();
                            // logged in!
                        } else {
                            // invalid login
                            this.presentToast('invalid password');
                            return false;
                        }
                    }
                }
            ],
            backdropDismiss: false,
        });
        await alert.present();
    }

    async presentToast(text) {
        const toast = await this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present().then(res => res);
    }
}
