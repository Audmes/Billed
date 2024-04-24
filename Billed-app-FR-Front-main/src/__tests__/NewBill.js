/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, within } from "@testing-library/dom";
import "@testing-library/jest-dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

// import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills.js";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

const setNewBill = () => {
    return new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
    });
};

beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
    });

    window.localStorage.setItem(
        "user",
        JSON.stringify({
        type: "Employee",
        email: "a@a",
        })
    );
});

beforeEach(() => {
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();

    // DOM construction
    // document.body.innerHTML = NewBillUI();
    const html = NewBillUI();
    document.body.innerHTML = html;

    window.onNavigate(ROUTES_PATH.NewBill);
});

afterEach(() => {
    jest.resetAllMocks();
    document.body.innerHTML = "";
});

// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then ...", () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html
//       //to-do write assertion
//     })
//   })
// })

// Je suis connecté comme employé
describe("Given I am connected as an employee", () => {  
    // Quand je suis sur la page NewBill
    describe("When I am on NewBill Page", () => {
        // Scénario 9 - E2E
        // Un formulaire avec 9 champs doit être affiché
        test('Then a form with nine fields should be rendered', () => {
            // get DOM element
            const form = document.querySelector('form');
            // expected results
            expect(form.length).toEqual(9);
        });

        // Scénario 10 - E2E
        // L’icône NewBill dans la barre verticale doit être mis en surbrillance
        test("Then newBill icon in vertical layout should be highlighted", async () => {
            // get DOM element
            const windowIcon = screen.getByTestId("icon-mail");
            // expected results
            expect(windowIcon).toHaveClass("active-icon");
        });

        // Scénario 11 - E2E
        // La valeur par défaut du champ PCT doit être 20
        describe("When nothing has been typed in PCT input", () => {
            test("then the PCT should be 20 by default", () => {
                const newBill = setNewBill();
                const inputData = bills[0];
                const newBillForm = screen.getByTestId("form-new-bill");
                const handleSubmit = jest.spyOn(newBill, "handleSubmit");
                const updateBill = jest.spyOn(newBill, "updateBill");

                newBill.fileName = inputData.fileName;
                newBillForm.addEventListener("submit", handleSubmit);
                fireEvent.submit(newBillForm);
                
                // expected results
                expect(handleSubmit).toHaveBeenCalledTimes(1);
                expect(updateBill).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pct: 20,
                    })
                );
            });
        });

        // Scénario 12 - E2E
        // Si les champs sont vides
        describe("When I do not fill fields and I click on submit button", () => {
            // Je dois rester du la page NewBill
            test("Then, it should stay on newBill page", () => {
                const newBill = setNewBill();
                const newBillForm = screen.getByTestId("form-new-bill");
                const handleSubmit = jest.spyOn(newBill, "handleSubmit");

                newBillForm.addEventListener("submit", handleSubmit);
                fireEvent.submit(newBillForm);

                // expected results
                expect(handleSubmit).toHaveBeenCalledTimes(1);
                expect(newBillForm).toBeVisible();
            });
        });

        // Fix bug Issue 5
        // Scénario 13 - E2E
        // Ajouter un test d'intégration POST new bill.
        // Si les champs sont valides et que je clique sur le bouton envoyé
        describe('When is a valid form and I click on submit button', () => {
            // Une nouvelle facture doit être créée
            test('Then a new bill should be created', () => {
                // DOM construction
                const html = NewBillUI();
                document.body.innerHTML = html;
        
                Object.defineProperty(window, "localStorage", { value: localStorageMock });
                window.localStorage.setItem(
                  "user",
                  JSON.stringify({
                    type: "Employee",
                  })
                );
        
                const onNavigate = (pathname) => {
                  document.body.innerHTML = ROUTES({ pathname })
                }
          
                const bills = new NewBill({ document, onNavigate, localStorage });
        
                const handleSubmit = jest.fn(bills.handleSubmit)
                const submitBtn = screen.getByTestId("form-new-bill")
                submitBtn.addEventListener("submit", handleSubmit)
                fireEvent.submit(submitBtn)
                expect(handleSubmit).toHaveBeenCalled()
            });
        });

        // Scénario 14 - E2E
        // Si un mauvais format de fichier est chargé
        describe("When I am on NewBill page and I upload a file with an extension other than jpg, jpeg or png", () => {
            // Un message d'erreur doit s'afficher
            test("Then an error message for the file input should be displayed", () => {
                const newBill = setNewBill();
                const handleChangeFile = jest.spyOn(newBill, "handleChangeFile");
                const imageInput = screen.getByTestId("file");
                const fileValidation = jest.spyOn(newBill, "fileValidation");

                imageInput.addEventListener("change", handleChangeFile);
                fireEvent.change(imageInput, {
                    target: {
                        files: [
                        new File(["document"], "document.pdf", {
                            type: "application/pdf",
                        }),
                        ],
                    },
                });

                expect(handleChangeFile).toHaveBeenCalledTimes(1);
                expect(fileValidation.mock.results[0].value).toBeFalsy();
                expect(imageInput).toHaveClass("is-invalid");
            });
        });

        // Scénario 15 - E2E
        // Si le fichier chargé est dans le bon format
        describe("When I am on NewBill page and I upload a file with an extension jpg, jpeg or png", () => {
            // Aucun message d'erreur ne doit être affiché
            test("Then no error message for the file input should be displayed", () => {
                const newBill = setNewBill();

                const handleChangeFile = jest.spyOn(newBill, "handleChangeFile");
                const imageInput = screen.getByTestId("file");
                const fileValidation = jest.spyOn(newBill, "fileValidation");

                imageInput.addEventListener("change", handleChangeFile);

                fireEvent.change(imageInput, {
                target: {
                    files: [
                    new File(["image"], "image.jpg", {
                        type: "image/jpg",
                    }),
                    ],
                },
                });

                expect(handleChangeFile).toHaveBeenCalledTimes(1);
                expect(fileValidation.mock.results[0].value).toBeTruthy();
                expect(imageInput).not.toHaveClass("is-invalid");
            });
        });

        describe("When an error occurs on API", () => {
            test("Then new bill is added to the API but fetch fails with '404 page not found' error", async () => {
                const newBill = setNewBill();
                const mockedBill = jest
                .spyOn(mockStore, "bills")
                .mockImplementationOnce(() => {
                    return {
                    create: jest.fn().mockRejectedValue(new Error("Erreur 404")),
                    };
                });

                await expect(mockedBill().create).rejects.toThrow("Erreur 404");

                expect(mockedBill).toHaveBeenCalledTimes(1);
                expect(newBill.billId).toBeNull();
                expect(newBill.fileUrl).toBeNull();
                expect(newBill.fileName).toBeNull();
            });

            test("Then new bill is added to the API but fetch fails with '500 Internal Server error'", async () => {
                const newBill = setNewBill();
                const mockedBill = jest
                .spyOn(mockStore, "bills")
                .mockImplementationOnce(() => {
                    return {
                    create: jest.fn().mockRejectedValue(new Error("Erreur 500")),
                    };
                });

                await expect(mockedBill().create).rejects.toThrow("Erreur 500");

                expect(mockedBill).toHaveBeenCalledTimes(1);
                expect(newBill.billId).toBeNull();
                expect(newBill.fileUrl).toBeNull();
                expect(newBill.fileName).toBeNull();
            });
        });
    });
});