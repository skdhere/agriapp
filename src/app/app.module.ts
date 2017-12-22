import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

import { Api } from '../providers/providers';
import { AuthService } from '../providers/providers';
import { UserProvider } from '../providers/user/user';
import { Sql } from '../providers/sql/sql';

import { SelectSearchableModule } from '../components/select-searchable/select-searchable-module';

@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp, {
          platforms: {
            ios: {
              statusbarPadding: true
            },
            android: {
              statusbarPadding: true
            }
          },
          preloadModules: false
        }),
        IonicStorageModule.forRoot({
            name: '__agribridgeDb',
            driverOrder: ['sqlite', 'indexeddb', 'websql']
        }),
        SelectSearchableModule,
    ],
    bootstrap: [IonicApp],
        entryComponents: [
        MyApp,
    ],
    providers: [
        SQLite,
        SQLitePorter,
        UserProvider,
        Api,
        AuthService,
        Sql,
        StatusBar,
        SplashScreen,
        Camera,
        File,
        Transfer,
        FilePath,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
    ]
})
export class AppModule {}
