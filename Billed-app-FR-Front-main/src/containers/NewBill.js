import { ROUTES_PATH } from '../constants/routes.js';
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    
    const iconBill = this.document.querySelector(`div[data-testid="icon-window"]`); /* Added by me */
    iconBill.addEventListener('click', this.handleClickBill); /* Added by me */

    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`);
    formNewBill.addEventListener("submit", this.handleSubmit);

    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);

    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
    console.log(this.document);
    console.log(this.onNavigate);
    console.log(this.store);
  }

  /* Added by me */
  // Navigation avec les icones
  // not need to cover this function by tests
  /* istanbul ignore next */
  handleClickBill = () => {
    this.onNavigate(ROUTES_PATH['Bills']);
  };

  fileValidation = file => {
    /* Fix bug Issue 3 */
    // On verifie le type de fichier à uploader
    const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!fileTypes.includes(file.type)) {
      this.document
        .querySelector(`input[data-testid="file"]`)
        .classList.add("is-invalid");
      return false;
    }
    this.document
      .querySelector(`input[data-testid="file"]`)
      .classList.remove("is-invalid");
    return true;
  };

  handleChangeFile = async (e) => {
    // console.log(e.target.value);
    e.preventDefault();
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    const fileChamp = e.target;

    if (this.fileValidation(file) && this.store) {
      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;
      formData.append('file', file);
      formData.append('email', email);
      // Si le format est valide on enlève l'avertissement et on valide
      fileChamp.setCustomValidity('');
      
      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true
          },
        })
        .then(({fileUrl, key}) => {
          console.log(fileUrl);
          this.billId = key;
          this.fileUrl = fileUrl;
          this.fileName = fileName;
        });
    }else {
      // Si le format est invalide on indique le bon format
      return fileChamp.setCustomValidity("Le format doit être JPG, JPEG ou PNG");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value);
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending',
    };

    /* Fix bug Issue 3 */
    // Si pas de fichier selectionné, submit impossible
    if (!this.fileName) return;

    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH['Bills']);
  };

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills']);
      })
      .catch((error) => console.error(error));
    }
  };
}