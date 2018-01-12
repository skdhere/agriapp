import {Injectable} from "@angular/core";
import { Events } from 'ionic-angular';

const DB_NAME: string = '__agribridgeDb';
const win: any = window;

@Injectable()
export class Sql {
    private _db: any;

    constructor(public events?: Events) {
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

        this.query(`CREATE TABLE IF NOT EXISTS tbl_errors (
            id INTEGER PRIMARY KEY,
            local_id INTEGER,
            tablename text,
            error_code text,
            error_message text
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_error', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_state (
            id INTEGER PRIMARY KEY,
            name text
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_state', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_district (
            id INTEGER PRIMARY KEY,
            state_id INTERGER,
            name text
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_district', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_taluka (
            id INTEGER PRIMARY KEY,
            district_id INTERGER,
            name text
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_taluka', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_village (
            id INTEGER PRIMARY KEY,
            taluka_id INTERGER,
            name text
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_village', err.tx, err.err);
        });

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
            console.error('Storage: Unable to create tbl_personal_detail tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_residence_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f7_resistatus TEXT,
            f7_phouse TEXT,
            f7_pstreet TEXT,
            f7_parea TEXT,
            f7_pstate TEXT,
            f7_pdistrict TEXT,
            f7_ptaluka TEXT,
            f7_pvillage TEXT,
            f7_ppin TEXT,
            f7_chouse TEXT,
            f7_cstreet TEXT,
            f7_carea TEXT,
            f7_cstate TEXT,
            f7_cdistrict TEXT,
            f7_ctaluka TEXT,
            f7_cvillage TEXT,
            f7_cpin TEXT,

            f7_status INTEGER,
            f7_created_date text,
            f7_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_residence_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_applicant_knowledge (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f2_edudetail TEXT,
            f2_proficiency TEXT,
            f2_participation TEXT,
            f2_typeprog TEXT,
            f2_date TEXT,
            f2_durprog TEXT,
            f2_condprog TEXT,
            f2_cropprog TEXT,
            f2_pname TEXT,

            f2_status INTEGER,
            f2_created_date text,
            f2_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_applicant_knowledge tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_spouse_knowledge (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f4_edudetail TEXT,
            f4_proficiency TEXT,
            f4_participation TEXT,
            f4_typeprog TEXT,
            f4_date TEXT,
            f4_durprog TEXT,
            f4_condprog TEXT,
            f4_cropprog TEXT,
            f4_pname TEXT,

            f4_status INTEGER,
            f4_created_date text,
            f4_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_spouse_knowledge tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_applicant_phone (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f5_phonetype TEXT,
            f5_servpro TEXT,
            f5_network TEXT,
            f5_datapack TEXT,
            f5_datapackname TEXT,
            f5_appuse TEXT,
            f5_farmapp TEXT,

            f5_status INTEGER,
            f5_created_date text,
            f5_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_applicant_phone tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_family_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f6_points TEXT,
            f6_jointfamily TEXT,
            f6_members TEXT,
            f6_children TEXT,
            f6_smartuse TEXT,

            f6_status INTEGER,
            f6_created_date text,
            f6_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_family_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_appliances_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f7_television,
            f7_refrigerator,
            f7_wmachine,
            f7_mixer,
            f7_stove,
            f7_bicycle,
            f7_ccylinder,
            f7_fans,
            f7_motorcycle,
            f7_car,

            f7_status INTEGER,
            f7_created_date text,
            f7_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_appliances_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_spouse_details (
            fm_caid INTEGER,
            fm_id INTEGER,

            f3_married_status TEXT,
            f3_spouse_fname TEXT,
            f3_spouse_mname TEXT,
            f3_spouse_lname TEXT,
            f3_spouse_age TEXT,
            f3_spouse_mobno TEXT,
            f3_spouse_adhno TEXT,
            f3_loan_interest TEXT,
            f3_loan_tenure TEXT,
            f3_loan_emi TEXT,
            f3_spouse_shg TEXT,
            f3_spouse_income TEXT,
            f3_spouse_shgname TEXT,
            f3_spouse_occp TEXT,
            f3_spouse_mfi TEXT,
            f3_loan_purpose TEXT,
            f3_spouse_mfiname TEXT,
            f3_spouse_mfiamount TEXT,

            f3_status INTEGER,
            f3_created_date text,
            f3_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_spouse_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_land_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f9_name TEXT,
            f9_land_size TEXT,
            f9_owner TEXT,
            f9_lease_year TEXT,
            f9_amount_on_rent TEXT,
            f9_contract_year TEXT,
            f9_state TEXT,
            f9_district TEXT,
            f9_taluka TEXT,
            f9_vilage TEXT,
            f9_survey_number TEXT,
            f9_pincode TEXT,
            f9_soil_type TEXT,
            f9_soil_tested TEXT,

            f9_status INTEGER,
            f9_created_date text,
            f9_modified_date text,

            local_land_id INTEGER PRIMARY KEY,
            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_land_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_asset_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f12_vehicle TEXT,
            f12_machinery TEXT,
            f12_any_other_assets TEXT,
            f12_name_of_other_assets TEXT,
            
            f12_status INTEGER,
            f12_created_date text,
            f12_modified_date text,

            local_land_id INTEGER PRIMARY KEY,
            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_asset_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_livestock_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f13_dairy_cattle  INTEGER,
            f13_draft_cattle  INTEGER,
            f13_buffalo INTEGER,
            f13_ox INTEGER,
            f13_sheep INTEGER,
            f13_goat INTEGER,
            f13_pig INTEGER,
            f13_poultry INTEGER,
            f13_donkeys INTEGER,
            
            f13_status INTEGER,
            f13_created_date text,
            f13_modified_date text,

            local_land_id INTEGER PRIMARY KEY,
            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_livestock_details tables', err.tx, err.err);
        });


        this.query(`CREATE TABLE IF NOT EXISTS tbl_cultivation_data (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f10_land TEXT,
            f10_cultivating TEXT,
            f10_crop_variety TEXT,
            f10_stage TEXT,
            f10_expected INTEGER,
            f10_expectedprice TEXT,
            f10_expectedincome TEXT,
            f10_diseases TEXT,
            f10_pest TEXT,
            
            f10_status INTEGER,
            f10_created_date TEXT,
            f10_modified_date TEXT,

            local_crop_id INTEGER PRIMARY KEY,
            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_cultivation_data tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_yield_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            f11_cultivating TEXT,
            f11_achieved TEXT,
            f11_income TEXT,
            f11_diseases TEXT,
            f11_fertilizers TEXT,

            f11_status INTEGER,
            f11_created_date text,
            f11_modified_date text,

            local_crop_id INTEGER PRIMARY KEY,
            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_yield_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_financial_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            loan_want TEXT,
            loan_amount TEXT,
            fx_monthly_income TEXT,
            f8_loan_taken TEXT,
            f8_private_lenders TEXT,
            f8_borrowed_amount_date TEXT,
            f8_borrowed_amount TEXT,
            f8_borrowed_loan_per TEXT,
            f8_borrowed_loan_month TEXT,
            f8_borrowed_total_amount TEXT,
            f8_borrowed_total_int TEXT,
            f8_borrowed_amount_emi TEXT,
            f8_borrowed_emi_paid TEXT,
            f8_borrowed_outstanding_amount TEXT,
            f8_borrowed_outstanding_principal TEXT,
            f8_borrowed_amount_emi_rem TEXT,

            f8_status INTEGER,
            f8_created_date text,
            f8_modified_date text,

            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_financial_details tables', err.tx, err.err);
        });

        this.query(`CREATE TABLE IF NOT EXISTS tbl_loan_details (
            fm_caid INTEGER,
            fm_id INTEGER,
            
            loan_sanctioned TEXT,
            loan_type TEXT,
            loan_provider TEXT,
            f15_borrowed_amount TEXT,
            f15_borrowed_loan_per TEXT,
            f15_borrowed_loan_month TEXT,
            f15_borrowed_total_amount TEXT,
            f15_borrowed_total_int TEXT,
            f15_borrowed_amount_emi TEXT,
            f15_borrowed_emi_paid TEXT,
            f15_borrowed_outstanding_amount TEXT,
            f15_borrowed_outstanding_principal TEXT,
            f15_borrowed_amount_emi_rem TEXT,

            f15_status INTEGER,
            f15_created_date text,
            f15_modified_date text,

            local_loan_id INTEGER PRIMARY KEY,
            local_upload INTEGER DEFAULT 0
        )`).catch(err => {
            console.error('Storage: Unable to create tbl_loan_details tables', err.tx, err.err);
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

    getDb(){
        return this._db;
    }

    async updateUploadStatus(tablename, farmerId, status){
        if(tablename === 'tbl_farmers'){
            await this.query('UPDATE '+ tablename +' SET local_upload = ? WHERE local_id = ?', [status, farmerId])
            .then(success => {
                //nothing to do for now
            },
            err => {
                console.error('SQL: Unable to update local_upload status of '+ tablename +' table', err.tx, err.err);
            });
        }else{
            await this.query('UPDATE '+ tablename +' SET local_upload = ? WHERE fm_id = ?', [status, farmerId])
            .then(success => {
                if (status == 0) {
                    this.events.publish('table:updated', tablename, farmerId);
                    this.query('UPDATE tbl_farmers SET local_upload = ? WHERE local_id = ?', [status, farmerId]).catch(err => {
                        console.error('SQL: Unable to update local_upload status of '+ tablename +' table', err.tx, err.err);
                    });
                }
            },
            err => {
                console.error('SQL: Unable to update local_upload status of '+ tablename +' table', err.tx, err.err);
            });
        }
    }


    getFarmerByLocalId(local_id){
        return this.query('SELECT * FROM tbl_farmers WHERE local_id = ?', [local_id]);
    }

    set_fm_id(fm_id, local_id){
        this.query('UPDATE tbl_farmers SET fm_id = ? WHERE local_id = ?', [fm_id, local_id]).catch(err => {
            console.log(err);
        });
    }

    addError(tablename, local_id, code, msg){

        this.query('SELECT * FROM tbl_errors WHERE local_id = ? and tablename = ? and error_code = ?', [local_id, tablename, code]).then(data => {
            if(data.res.rows.length < 1){
                this.query('INSERT INTO tbl_errors(local_id, tablename, error_code, error_message) VALUES(?, ?, ?, ?)', [
                    local_id,
                    tablename,
                    code,
                    msg
                ]).catch(err => {
                    console.log(err);
                });
            }
        });
    }
}
