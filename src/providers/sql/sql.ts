import {Injectable} from "@angular/core";

const DB_NAME: string = '__agribridgeDb';
const win: any = window;

@Injectable()
export class Sql {
    private _db: any;

    constructor() {
        if (win.sqlitePlugin) {
            this._db = win.sqlitePlugin.openDatabase({
                name: DB_NAME,
                location: 2,
                createFromLocation: 0
            });
        } else {
            console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');

            this._db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
        }
        this.createTables();
    }

    // Initialize the DB with our required tables
    createTables() {

        this.query(`CREATE TABLE IF NOT EXISTS tbl_farmers (
            fm_caid INTEGER,
            fm_id INTEGER,
            fm_fname text,
            fm_mname text,
            fm_lname text,
            fm_aadhar text,
            fm_mobileno text,
            fm_status INTEGER,
            fm_createddt INTEGER,
            fm_createdby text,
            fm_modifieddt INTEGER,
            fm_modifiedby text,

            local_id INTEGER PRIMARY KEY,
            local_upload INTEGER DEFAULT 0
            )`).catch(err => {
                console.error('Storage: Unable to create tbl_farmers tables', err.tx, err.err);
            });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_personal_detail (
            fm_caid INTEGER,
            fm_id INTEGER,
            f1_mfname text,
            f1_mmname text,
            f1_dob text,
            f1_age INTEGER, 
            f1_mobno text,
            f1_altno text,
            any_other_select text,
            f1_ppno text, 
            f1_pancard text, 
            f1_vote text, 
            f1_licno text, 
            f1_otherno text, 
            f1_expfarm INTEGER,
            f1_status INTEGER,
            f1_created_date text,
            f1_modified_date text,

            local_upload INTEGER DEFAULT 0
            )`).catch(err => {
                console.error('Storage: Unable to create tbl_farmers tables', err.tx, err.err);
            });  
    }

    /**
    * Perform an arbitrary SQL operation on the database. Use this method
    * to have full control over the underlying database through SQL operations
    * like SELECT, INSERT, and UPDATE.
    *
    * @param {string} query the query to run
    * @param {array} params the additional params to use for query placeholders
    * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
    */
    query(query: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this._db.transaction((tx: any) => {
                    tx.executeSql(query, params,
                        (tx: any, res: any) => resolve({ tx: tx, res: res }),
                        (tx: any, err: any) => reject({ tx: tx, err: err }));
                },
                (err: any) => reject({ err: err }));
            } catch (err) {
                reject({ err: err });
            }
        });
    }
}
