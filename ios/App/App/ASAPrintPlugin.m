//
//  ASAPrintPlugin.m
//  App
//
//  Created by Mehul Mistri on 29/01/20.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(ASAPrintPlugin, "ASAPrintPlugin",
           CAP_PLUGIN_METHOD(print, CAPPluginReturnPromise);
           )

