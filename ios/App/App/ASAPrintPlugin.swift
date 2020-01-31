//
//  ASAPrintPlugin.swift
//  App
//
//  Created by Mac Book Pro on 31/07/19.
//

import Foundation
import Capacitor
import ExternalAccessory

@objc(ASAPrintPlugin)
public class ASAPrintPlugin: CAPPlugin {
    
    var escposPrinter: ESCPOSPrinter!
    
    @objc func registerForNotifications() {
        NotificationCenter.default.addObserver(self, selector: #selector(statusCheckReceived), name: NSNotification.Name.EADSessionDataReceived, object: nil)
        EAAccessoryManager.shared().registerForLocalNotifications()
    }
    
    @objc func statusCheckReceived(_ notification: NSNotification) {
        let sessionController = notification.object as! EABluetoothPort
        var bytesAvailable: UInt = 0
        var result: Data = Data()
        bytesAvailable = UInt(sessionController.readBytesAvailable())
        while bytesAvailable > 0 {
            if let data = sessionController.readData(bytesAvailable) {
                result.append(data)
            }
        }
    }
    
    @objc func print(_ call: CAPPluginCall) {
//        let host = call.getString("host")
//        if let host = host {
//            call.success(["host": host])
            if let imageBase64 = call.getString("image"), let decodedimage = imageBase64.base64ToImage() {
                DispatchQueue.main.async {
                    self.escposPrinter = ESCPOSPrinter()
                    let errCode = self.escposPrinter.openPort("bluetooth", withPortParam: 9100)
                    if errCode >= 0 {
                        call.success(["success":"Connection Established"])
                        self.registerForNotifications()
                        self.escposPrinter.print(decodedimage, withAlignment: ALIGNMENT_CENTER, withSize: BITMAP_NORMAL, withBrightness: 5)
                        self.escposPrinter.lineFeed(2)
                    } else if errCode == -3 {
                        call.success([
                            "Failure":"err Conn -3"
                            ])
                    } else {
                        let string = "err Conn else " + "\(errCode)"
                        call.success([
                            "Failure":string
                            ])
                    }
                }
            }
        //}
    }
}

extension String {
    func base64ToImage() -> UIImage? {
        if let url = URL(string: self),let data = try? Data(contentsOf: url),let image = UIImage(data: data) {
            return image
        }
        return nil
    }
}
