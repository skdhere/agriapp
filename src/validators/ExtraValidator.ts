import { FormControl, FormGroup } from '@angular/forms';
import { Sql } from '../providers/sql/sql';

export class ExtraValidator {


    static checkMobile(control: FormControl): any {

        return new Promise(resolve => {
            if (control.value) {
                setTimeout(() => {
                    let sql = new Sql;
                    sql.query("SELECT fm_mobileno FROM tbl_farmers WHERE fm_mobileno = ?", [control.value]).then((data) => {

                        if (data.res.rows.length > 0) {
                            resolve({
                                "taken": true
                            });
                        }
                        else{
                            sql.query("SELECT f3_spouse_mobno FROM tbl_spouse_details WHERE f3_spouse_mobno = ?", [control.value]).then((data) => {
                                if (data.res.rows.length > 0) {
                                    resolve({
                                        "taken": true
                                    });
                                }
                                else{
                                    resolve(null);
                                }
                            });
                        }

                    });
                }, 100);
            }else{
                resolve(null);
            }

        });
    }

    static checkAadhar(control: FormControl): any {

        return new Promise(resolve => {
            if (control.value) {
                setTimeout(() => {
                    let sql = new Sql;
                    sql.query("SELECT fm_aadhar FROM tbl_farmers WHERE fm_aadhar = ? UNION SELECT f3_spouse_adhno FROM tbl_spouse_details WHERE f3_spouse_adhno = ?", [control.value, control.value]).then((data) => {
                        if (data.res.rows.length > 0) {
                            resolve({
                                "taken": true
                            });
                        }
                        else{
                            resolve(null);
                        }
                    });
                }, 100);
            }else{
                resolve(null);
            }
            
        });
    }

}