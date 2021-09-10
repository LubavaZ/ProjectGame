'use strict'

import { score } from "./script.js";

export default class StorageRecords {
    constructor(name) {
        this.ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
        this.updatePassword;
        this.stringName = name;
        this.recordsContent = document.getElementById('records-content');
        this.storage = {};
        this.storageArr = null;
        this.getInfo();
    }

    getInfo() {
        $.ajax(
            {
                url: this.ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                data: { f: 'READ', n: this.stringName },
                success: this.readReady.bind(this), error: this.errorHandler
            });
    }

    updateStorage() {
        this.updatePassword = Math.random();
        $.ajax(
            {
                url: this.ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                data: { f: 'LOCKGET', n: this.stringName, p: this.updatePassword },
                success: this.lockGetReady.bind(this), error: this.errorHandler
            }
        );
    }

    lockGetReady(callresult) {
        if (callresult.error != undefined)
            alert(callresult.error);
        else {
            let bestName = document.getElementById('NAME').value;
            this.storageArr = JSON.parse(callresult.result);
            // this.storageArr.push({ name: bestName, record: score });
            this.storageArr.slice(10);
            $.ajax(
                {
                    url: this.ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                    data: { f: 'UPDATE', n: this.stringName, v: JSON.stringify(this.storageArr), p: this.updatePassword },
                    success: this.updateReady, error: this.errorHandler
                }
            );
        }
    }

    updateReady(callresult) {
        if (callresult.error != undefined)
            alert(callresult.error);
    }

    readReady(callresult) {
        if (callresult.error != undefined)
            alert(callresult.error);
        else if (callresult.result == '') {
            this.storageArr = [];
        } else if (callresult.result != "") {
            this.storageArr = JSON.parse(callresult.result);
            console.log(this.storageArr);
            this.createRecordTable(this.recordsContent, this.storageArr);
        }
    }

    compareScore(a, b) {
        return b.record - a.record;
    }

    createRecordTable(field, data) {
        var pageHTML = '';
        data.sort(this.compareScore);
        pageHTML += '<table border=1 width="100%"><tbody>';
        pageHTML += '<td>' + '№' + '</td>' + '<td>' + 'ИМЯ' + '</td>' + '<td>' + 'СЧЕТ' + '</td>';
        for (var i = 0; i < data.length; i++) {
            if (i > 6) {
                break;
            }
            pageHTML += '<tr>';
            pageHTML += '<td>' + (i + 1) + '</td>' + '<td>' + data[i].name + '</td>' + '<td>' + data[i].record + '</td>';
            pageHTML += '</tr>';
        }
        pageHTML += '</tbody></table>';
        field.innerHTML = pageHTML;
    }

    errorHandler(jqXHR, statusStr, errorStr) {
        alert(statusStr + ' ' + errorStr);
    }
}