/**
 * @jest-environment jsdom
 */

// import {screen, waitFor} from "@testing-library/dom";
// import BillsUI from "../views/BillsUI.js";
// import { bills } from "../fixtures/bills.js";
// import { ROUTES_PATH} from "../constants/routes.js";
// import {localStorageMock} from "../__mocks__/localStorage.js";

// import router from "../app/Router.js";

import {screen, waitFor} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

jest.mock("../app/store", () => mockStore);

// Test for BillsUI.js
// Je suis connecté en tant qu’employé
describe("Given I am connected as an employee", () => {
    // Quand je suis sur la page Bills
    describe("When I am on Bills Page", () => {
        // Scénario 5 - E2E
        // L’icône Bill dans la barre verticale doit être mis en surbrillance.
        test("Then bill icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(
                window, 'localStorage', { value: localStorageMock }
            );
            window.localStorage.setItem(
                'user', JSON.stringify({ type: 'Employee'})
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
            await waitFor(() => screen.getByTestId('icon-window'));
            const windowIcon = screen.getByTestId('icon-window');
            //to-do write expect expression
            /* Fixe le bug Issue 5 */
            expect(windowIcon.classList.contains("active-icon")).toBe(true); /* Added by me */
        });

        // Scénario 6 - E2E
        // Les factures sont triées par ordre du plus récent au plus ancien
        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills });
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
            const antiChrono = (a, b) => ((a < b) ? 1 : -1);
            const datesSorted = [...dates].sort(antiChrono);
            expect(dates).toEqual(datesSorted);
        });
    });

    // Scénario 7 - E2E
    // Quand je suis sur la page Bills, il y a un titre et un bouton New Bill
    describe("When I am on Bills page, there are a title and a newBill button", () => {
        test("Then, the title and the button should be render correctly", () => {
            document.body.innerHTML = BillsUI({ data: [] });
            expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
            expect(screen.getByTestId("btn-new-bill")).toBeTruthy();
        });
    });

    /* Added by me */
    // Scénario 8 - E2E
    // Quand je clique sur le bouton visualisé
    describe("When employee click on eye Button", () => {
        // Une modale s’ouvre et affiche le visuel de mon justificatif
        test("Then modal should be displayed", () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            Object.defineProperty(
                window, 'localStorage', { value: localStorageMock }
            );
            window.localStorage.setItem(
                "user", JSON.stringify({ type: "Employee" })
            );

            const billsDashboard = new Bills({
                document,
                onNavigate,
                store: null,
                bills: bills,
                localStorage: window.localStorage,
            });

            /* Mock fonction JQuery */
            $.fn.modal = jest.fn();

            document.body.innerHTML = BillsUI({ data: { bills } });

            const iconEye = screen.getAllByTestId("btn-new-bill")[0];
            const handleClickIconEye = jest.fn(
                billsDashboard.handleClickIconEye(iconEye)
            );

            iconEye.addEventListener("click", handleClickIconEye);
            userEvent.click(iconEye);

            expect(handleClickIconEye).toHaveBeenCalled();
            expect($.fn.modal).toHaveBeenCalled();
            expect(screen.getByTestId("modal")).toBeTruthy();
            expect(screen.getByTestId("modal-title")).toBeTruthy();
        });
    });

    /* Added by me */
    // Scénario 4 - E2E
    // Je clique sur le bouton Nouvelle note de frais
    describe("When employee click on new bill", () => {
        // Je suis envoyé sur la page New Bill et un formulaire doit être affiché
        test("Then, It should renders NewBill page and a form should be displayed", () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            Object.defineProperty(
                window, "localStorage", { value: localStorageMock, })
                window.localStorage.setItem(
                    "user",
                    JSON.stringify({ type: "Employee", })
            );

            const billsDashboard = new Bills({
                document,
                onNavigate,
                store: null,
                bills: bills,
                localStorage: window.localStorage,
            });

            const newBillBtn = screen.getByTestId("btn-new-bill");
            const handleClickNewBill = jest.fn(billsDashboard.handleClickNewBill);

            newBillBtn.addEventListener("click", handleClickNewBill);
            userEvent.click(newBillBtn);

            expect(handleClickNewBill).toHaveBeenCalled();
            expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
            expect(screen.getByTestId("form-new-bill")).toBeTruthy();
        });
    });
});

// Test d'intégration GET - Api Get Bills
/* Added by me */
describe("Given I am a user connected as Employee", () => {
    // Quand je navigue vers Bill
    describe("When I navigate to Bill", () => {
        // récupère les factures à partir du mock de l'API GET
        test("fetches bills from mock API GET", async () => {
            localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Dashboard);
        });

        // Lorsqu'une erreur se produit sur l'API
        describe("When an error occurs on API", () => {
            beforeEach(() => {
                jest.spyOn(mockStore, "bills");
                Object.defineProperty(
                    window,
                    'localStorage',
                    { value: localStorageMock }
                );
                jest.spyOn(mockStore, "bills");
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee',
                    email: "a@a"
                }));
                const root = document.createElement("div");
                root.setAttribute("id", "root");
                document.body.appendChild(root);
                router();
            });
        
            // Récupère les factures de l'API et les échecs avec un message d'erreur 404
            test("Then,fetches bills from an API and fails with 404 message error", async () => {
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                    list : () =>  {
                        return Promise.reject(new Error("Erreur 404"))
                    }
                    }})
                window.onNavigate(ROUTES_PATH.Dashboard)
                await new Promise(process.nextTick);
                const message = await screen.getByText(/Erreur 404/)
                expect(message).toBeTruthy()
            });
            
            // Récupère les messages de l'API et les échecs avec un message d'erreur 500
            test("Then, fetches messages from an API and fails with 500 message error", async () => {
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                        list : () =>  {
                            return Promise.reject(new Error("Erreur 500"));
                        }
                    };
                });
            
                window.onNavigate(ROUTES_PATH.Bills)
                await new Promise(process.nextTick);
                const message = await screen.getByText(/Erreur 500/)
                expect(message).toBeTruthy()
            });

        });
    });
});