import { ROUTES_PATH } from '../constants/routes.js';
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class Bills { /* Bills était manquant */
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;

    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`);
    // no need to cover this function by tests
    /* istanbul ignore next*/
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill);

    // Navigation avec les icones
    const iconNewBill = document.querySelector(`div[data-testid="icon-mail"]`); /* Added by me */
    // no need to cover this function by tests
    /* istanbul ignore next*/
    if (iconNewBill) iconNewBill.addEventListener('click', this.handleClickNewBill); /* Added by me */
    
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    // condition toujours vraie
    // if (iconEye)
    // fix : si la liste des nouvelles notes de frais n'est pas vide, alors...
    if (iconEye.length !== 0)
      iconEye.forEach((icon) => {
        icon.addEventListener('click', () => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate });
  };

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill']);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5);
    $('#modaleFile')
      .find(".modal-body")
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );
    // $('#modaleFile').modal('show');
    // no need to cover this function by tests
    /* istanbul ignore next*/
    if (typeof $('#modaleFile').modal === 'function')
      $('#modaleFile').modal('show');
  };

    // no need to cover this function by tests
    /* istanbul ignore next*/
    getBills = () => {
        // const userEmail = localStorage.getItem('user') 
        //     ? JSON.parse(localStorage.getItem('user')).email
        //     : '';
        if (this.store) {
            return this.store
            .bills()
            .list()
            .then((snapshot) => {
                const bills = snapshot
                /* Fixe le bug Issue 1 */
                /* On trie dans l'ordre par date */
                .sort((a, b) => (a.date < b.date) ? 1 : -1)
                .map((doc) => {
                    try {
                        return {
                            ...doc,
                            date: formatDate(doc.date),
                            status: formatStatus(doc.status)
                        };
                    } catch(e) {
                        // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                        // log the error and return unformatted date in that case
                        console.log(e,'for',doc);
                        return {
                          ...doc,
                          date: doc.date,
                          status: formatStatus(doc.status)
                        };
                    }
                });
                // .filter((bill) => bill.email === userEmail);
                console.log('length', bills.length);
                return bills;
            })
            // .catch((error) => error);
            .catch((error) => Promise.reject(Error(error)));
        }
    };
}