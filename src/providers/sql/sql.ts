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
