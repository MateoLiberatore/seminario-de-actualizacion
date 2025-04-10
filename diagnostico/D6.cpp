#include <iostream>
#include <string>
#include <cctype>
#include <clocale>
#include <iomanip>




const int total = 500;
int user_count = 4;
int prod_count = 3;
std::string log_name;
std::string log_password;

struct User {
    std::string user_name;
    std::string user_password;
};

struct product {
    int id;
    std::string name;
    double price;
    int stock;
};

User users[total] = {
    {"User1", "user1password"},
    {"User2", "user2password"},
    {"User3", "user3password"},
    {"admin", "adminpassword"}
};
 
product products[total] = {
    {1, "Lavandina x 1L", 875.25, 3000},
    {4, "Detergente x 500mL", 1102.45, 2010},
    {22, "Jabon en polvo x 250g", 650.22, 407}
};

//starting options
void login();
void add_user();
//password tools
void password_mod();
bool pass_verification(std::string password);
//crud tools
void product_crud();
void add_product();
void delete_product();
void print_products();
void update_product();


void update_product(){
    system("cls");
    std::string update_name;
    int update_id;

    while (true) {
        std::string option;
        system("cls");
        std::cout << "Modificacion de productos." << std::endl;
        std::cout << "1. Buscar producto por ID." << std::endl;
        std::cout << "2. Buscar producto por nombre." << std::endl;
        std::cout << "x. Salir." << std::endl;
        std::cout << "Buscar por (ingrese numero o 'x'): ";
        std::cin >> option;

        if (option == "x" || option == "X") break;

        if (option == "1") {
            system("cls");
            std::cout << "Ingrese ID del producto: ";
            std::cin >> update_id;

            for (int i = 0; i < total; i++) {
                if (products[i].id == update_id) {

                    std::string field;
                    std::string new_name;
                    double new_price;
                    int new_stock;

                    std::cout 
                        << "ID: " << products[i].id 
                        << " Nombre: " << products[i].name 
                        << " Precio: " << products[i].price 
                        << " Stock: " << products[i].stock 
                        << std::endl;

                    std::cout << "Elija campo a modificar: " << std::endl;
                    std::cout << "1. Nombre" << std::endl;
                    std::cout << "2. Precio" << std::endl;
                    std::cout << "3. Stock" << std::endl;
                    std::cout << "x. Salir" << std::endl;
                    std::cout << "Opcion: ";
                    std::cin >> field;

                    if (field == "1") {
                        system("cls");
                        std::cout << "Nombre actual: " << products[i].name << std::endl; 
                        std::cout << "Ingrese nuevo nombre: ";

                        std::cin.ignore();
                        std::getline(std::cin, new_name);
                        products[i].name = new_name;

                        std::cout << "El nombre fue cambiado a: " << new_name << std::endl;
                        system("pause");
                    } 
                    
                    else if (field == "2") {
                        system("cls");
                        std::cout << "Precio actual: " << products[i].price << std::endl;
                        std::cout << "Ingrese nuevo precio: ";

                        std::cin >> new_price;
                        products[i].price = new_price;

                        std::cout << "El precio fue cambiado a: " << new_price << std::endl;
                        system("pause");
                    } 
                    
                    else if (field == "3") {
                        system("cls");
                        std::cout << "Stock actual: " << products[i].stock << std::endl;
                        std::cout << "Ingrese nuevo stock: ";

                        std::cin >> new_stock;
                        products[i].stock = new_stock;

                        std::cout << "El stock fue cambiado a: " << new_stock << std::endl;
                        system("pause");
                    }

                    break;
                }
            }
        } else if (option == "2") {
            system("cls");
            std::cout << "Ingrese nombre del producto: ";
            std::cin >> update_name;

            for (int i = 0; i < total; i++) {
                if (products[i].name == update_name) {
                    std::string field;
                    std::string new_name;
                    double new_price;
                    int new_stock;

                    std::cout 
                        << "ID: " << products[i].id 
                        << " Nombre: " << products[i].name 
                        << " Precio: " << products[i].price 
                        << " Stock: " << products[i].stock 
                        << std::endl;

                    std::cout << "Elija campo a modificar: " << std::endl;
                    std::cout << "1. Nombre" << std::endl;
                    std::cout << "2. Precio" << std::endl;
                    std::cout << "3. Stock" << std::endl;
                    std::cout << "x. Salir" << std::endl;
                    std::cout << "Opcion: ";
                    std::cin >> field;

                    if (field == "1") {
                        system("cls");
                        std::cout << "Nombre actual: " << products[i].name << std::endl;
                        std::cout << "Ingrese nuevo nombre: ";

                        std::cin.ignore();
                        std::getline(std::cin, new_name);

                        products[i].name = new_name;
                        std::cout << "El nombre fue cambiado a: " << new_name << std::endl;
                        system("pause");
                    } 

                    else if (field == "2") {
                        system("cls");
                        std::cout << "Precio actual: " << products[i].price << std::endl;
                        std::cout << "Ingrese nuevo precio: ";

                        std::cin >> new_price;
                        products[i].price = new_price;

                        std::cout << "El precio fue cambiado a: " << new_price << std::endl;
                        system("pause");
                    } 
                    
                    else if (field == "3") {
                        system("cls");
                        std::cout << "Stock actual: " << products[i].stock << std::endl;
                        std::cout << "Ingrese nuevo stock: ";

                        std::cin >> new_stock;
                        products[i].stock = new_stock;

                        std::cout << "El stock fue cambiado a: " << new_stock << std::endl;
                        system("pause");
                    }

                    break;
                }
            }
        } else {
            std::cout << "Opcion invalida. Intente de nuevo." << std::endl;
            system("pause");
        }
    }
}

void add_product() {
    while (true) {
        system("cls");
        std::cout << "Agregar producto\n";

        std::string new_name;
        double new_price;
        int stock;

        std::cout << "Nombre: ";
        std::cin.ignore();
        std::getline(std::cin, new_name);
        std::cout << "Precio: ";
        std::cin >> new_price;
        std::cout << "Stock: ";
        std::cin >> stock;

        int generated_id = 1;
        bool id_encontrado = false;

        for (int id_check = 1; id_check <= total; id_check++) {
            bool ocupado = false;
            for (int i = 0; i < total; i++) {
                if (products[i].id == id_check) {
                    ocupado = true;
                    break;
                }
            }
            if (!ocupado) {
                generated_id = id_check;
                id_encontrado = true;
                break;
            }
        }

        if (!id_encontrado) {
            std::cout << "Error: no hay más espacio en memoria.\n";
            system("pause");
            break;
        }

        bool added = false;
        for (int i = 0; i < total; i++) {
            if (products[i].id == 0) {
                products[i] = { generated_id, new_name, new_price, stock };
                printf("- ID: %-d\t - Nombre: %-s\t - Precio: %.2f\t - Stock: %-d\n",
                       generated_id, new_name.c_str(), new_price, stock);
                added = true;
                break;
            }
        }

        if (!added) {
            std::cout << "Error: no hay más espacio en memoria.\n";
            system("pause");
            break;
        }
       
        char go_on;
        std::cout << "\n¿Deseás agregar otro producto? (s/n): ";
        std::cin.ignore();
        
        std::cin >> go_on;
        if (tolower(go_on) != 's') {
            break;
        }
    }
}

void delete_product() {

    system("cls");
    int search_id;
    std::string search_name;
    std::string option;

    while (true) {
        system("cls");
        std::cout << "Menu de borrado" << std::endl;
        std::cout << "1. Borrar por id" << std::endl;
        std::cout << "2. Borrar por nombre" << std::endl;
        std::cout << "x. Salir" << std::endl;
        std::cout << "Seleccione una opcion: ";
        std::cin >> option;

        if (option == "1") {
            system("cls");
            std::cout << "Eliminar producto por id: ";
            std::cin >> search_id;

            for (int i = 0; i < total; i++) {
                if (products[i].id == search_id) {
                    while (true) {
                        printf("| ID: %-d\t | Nombre: %-s\t | Precio: %.2f\t | Stock: %-d\n", 
                            products[i].id, products[i].name.c_str(), products[i].price, products[i].stock);
                        std::cout << "------------------------------" << std::endl;
                        std::cout << "Borrar producto?: " << std::endl;
                        std::cout << "1. Borrar" << std::endl;
                        std::cout << "2. Salir" << std::endl;
                        std::cin >> option;

                        if (option == "1") {
                            for (int j = i; j < prod_count - 1; j++) {
                                products[j] = products[j + 1];
                            }
                            products[prod_count - 1] = {0, "", 0.0, 0};
                            prod_count--;
                            std::cout << "Producto con ID: " << search_id << " eliminado." << std::endl;
                            system("pause");
                            break;
                        } else if (option == "2") {
                            return;
                        } else {
                            std::cout << "Opcion invalida, intente de nuevo" << std::endl;
                            system("pause");
                        }
                    }
                    break;
                }
            }

        } else if (option == "2") {
            system("cls");
            std::cout << "Eliminar producto por nombre: ";
            std::cin >> search_name;

            for (int i = 0; i < total; i++) {
                if (products[i].name == search_name) {

                    while (true) {
                        printf("| ID: %-d\t | Nombre: %-s\t | Precio: %.2f\t | Stock: %-d\n", 
                            products[i].id, products[i].name.c_str(), products[i].price, products[i].stock);

                        std::cout << "------------------------------" << std::endl;
                        std::cout << "Borrar producto?: " << std::endl;
                        std::cout << "1. Borrar" << std::endl;
                        std::cout << "2. Salir" << std::endl;
                        std::cin >> option;

                        if (option == "1") {
                            for (int j = i; j < prod_count - 1; j++) {
                                products[j] = products[j + 1];
                            }
                            products[prod_count - 1] = {0, "", 0.0, 0};
                            prod_count--;
                            std::cout << "Producto " << search_name << " eliminado." << std::endl;
                            system("pause");
                            break;
                        } else if (option == "2") {
                            break;
                        } else {
                            std::cout << "Opcion invalida, intente de nuevo" << std::endl;
                            system("pause");
                        }
                    }
                    break;
                }
            }

        } else if (option == "x" || option == "X") {

            std::cout << "Saliendo..." << std::endl;
            system("pause");
            return;

        } else {
            std::cout << "Opcion invalida, elija nuevamente" << std::endl;
            system("pause");
        }
    }
}

void print_products(){
    system("cls");
    bool found = false;

    std::cout << std::left                      // titulos de columna 
              << "| " << std::setw(5) << "ID"      
              << "| " << std::setw(30) << "Nombre" 
              << "| " << std::setw(10) << "Precio"
              << "| " << std::setw(10) << "Stock"   
              << "|\n";

    std::cout << std::string(60, '-') << std::endl;  // divisor para la tabla

    for (int i = 0; i < total; i++){
        if (products[i].id != 0){

            std::cout << "| " << std::setw(5) << products[i].id
                      << "| " << std::setw(30) << products[i].name
                      << "| " << std::setw(10) << std::fixed << std::setprecision(2) << products[i].price
                      << "| " << std::setw(10) << products[i].stock
                      << std::endl;
            
            }
        found = true;
    }
    if (!found) {
        std::cout << "No hay productos cargados." << std::endl;
    }
    system("pause");
}

void product_crud() {
    while (true) {
        system("cls");
        std::string option;

        std::cout << "1. Agregar Producto." << std::endl;
        std::cout << "2. Mostrar Productos." << std::endl;
        std::cout << "3. Modificar Producto." << std::endl;
        std::cout << "4. Eliminar Producto." << std::endl;
        std::cout << "x. Salir." << std::endl;
        std::cout << "Seleccione una opción: ";
        std::cin >> option;

        if (option == "1") {
            add_product();
        }
        else if (option == "2") {
            print_products();
        }
        else if (option == "3") {
            update_product();
        }
        else if (option == "4") {
            delete_product();
        }
        else if (option == "x" || option == "X") {
            return;
        }
        else {
            std::cout << "Opción inválida, intente nuevamente." << std::endl;
            system("pause");
        }
    }
}

void add_user() {
    std::string new_name;
    std::string new_pass; 
    std::cout << "Crear Usuario:" << std::endl;
    std::cout << "Nombre de usuario: ";
    std::cin >> new_name;

    do {
        system("cls");
        std::cout << "Contraseña: ";
        std::cout << "- debe contener un mínimo de 8 a 16 caracteres" << std::endl;
        std::cout << "- Al menos 1 mayúscula" << std::endl;
        std::cout << "- Al menos 2 símbolos especiales" << std::endl;
        std::cin >> new_pass;
    } while (!pass_verification(new_pass));


    for (int i = 0; i < total; i++) {

        if (users[i].user_name.empty()) {  
            users[i] = {new_name, new_pass};
            std::cout << "Usuario creado correctamente." << std::endl;
            break; 
        }
    }
    std::cout << "Usuarios actuales:" << std::endl;

    for (int i = 0; i < total; i++) {

        if (!users[i].user_name.empty()) {
            std::cout << users[i].user_name << " - " << users[i].user_password << std::endl;
        }
    }
}

bool pass_verification(std::string password){

    bool upper_case = false;
    int symbols = 0;
    if (password.empty()){
        std::cout << "no se permiten contraseñas vacias" << std::endl; 
        return false;
    }
    if (password.length() < 8 || password.length() > 16 ){
        std::cout << "la contraseña debe tener mas de 8 carateres o menos de 16" << std::endl;
        return false; 
    }
    for (char c : password) {
        if (std::isupper(c)) upper_case = true;
        if (std::ispunct(c)) symbols++;
    };
    if (!upper_case){
        std::cout << "la contraeña debe contener al menos una mayuscula" << std::endl;
        return false;
    }
    if (symbols < 2) {
        std::cout << "la contraseña debe contener dos caracteres especiales" << std::endl;
        return false;
    }      
    
    return true;
}

void password_mod(){

    std::string option;
    std::string new_pass;
    
    while (true){  
        system("cls");
        std::cout << "Modificacion de Contraseña" << std::endl;
        std::cout << "1.Cambiar Contraseña" << std::endl;
        std::cout << "X.Salir" << std::endl;
        std::cout << "Seleccione una opción: ";
        std::cin >> option ;

      
        if(option == "1"){
            system("cls");
            std::cout << "- debe contener un minimo de 8 a 16 caracteres" << std::endl;
            std::cout << "- 1 mayuscula" << std::endl;
            std::cout << "- 2 simbolos especiales" << std::endl;
            std::cout << "ingrese nueva contraseña:";
            std::cin >> new_pass;   

            if (pass_verification(new_pass)){
                    for (int i = 0; i < total; i++) {
                        if (users[i].user_name == log_name) {
                            users[i].user_password = new_pass;
                            }
                        }
                    std::cout << "Contraseña cambiada correctamente." << std::endl;
                    return;                 
                break;
            }else{
                system("cls"); 
                std::cout << "por favor, intente de nuevo" << std::endl;
                std::cout << "- debe contener un minimo de 8 a 16 caracteres" << std::endl;
                std::cout << "- 1 mayuscula" << std::endl;
                std::cout << "- 2 simbolos especiales" << std::endl; 
            }

            

        } else if (option == "x" || option == "X"){
            std::cout << "saliendo del menu" << std:: endl;
            return ;
        } else {
            std::cout << "opcion invalida" << std::endl;
        };

    };
    system("pause");
    return;
};

void login() {
    int tries = 0;
    std::string log_name;
    std::string log_password;
    
    std::cout << "Inicio de sesión" << std::endl;

    do {
        std::cout << "Ingrese nombre de Usuario: ";
        std::cin >> log_name;
        std::cout << "Ingrese su Contraseña: ";
        std::cin >> log_password;

        for (int i = 0; i < total; i++) {
            if (users[i].user_name == log_name && users[i].user_password == log_password) {
                std::cout << "¡Bienvenido/a " << log_name << "!" << std::endl;
                system("cls");
                return;
            }
        }

        tries++;
        std::cout << "Usuario y/o contraseña incorrecta. Intento " << tries << " de 3." << std::endl;
        system("pause");
        system("cls");

    } while (tries < 3);

    std::cout << "Usuario bloqueado. Contacte con el administrador." << std::endl;
    system("pause");
    return;
}

int main() {

    system("chcp 65001 > nul"); // ñ y caracteres especiales
    system("color E0"); // color de consola

    std::string option;

    std::cout << "Gestor de pedidos" << std::endl;
    std::cout << "1. Log in" << std::endl;
    std::cout << "2. Crear nuevo usuario" << std::endl;
    std::cout << "Ingrese una opcion: ";
    std::cin >> option;

    if (option == "1") {
        login();
    } else if (option == "2") {
        add_user();
    }

    while (true) {
        system("cls");
        std::cout << "1. Cambiar contraseña" << std::endl;
        std::cout << "2. Gestor de productos" << std::endl;
        std::cout << "x. Salir" << std::endl;
        std::cout << "Seleccione una opción: ";
        std::cin >> option;

        if (option == "1") {
            password_mod();
        } else if (option == "2") {
            product_crud();
        } else if (option == "x" || option == "X") {
            std::cout << "Saliendo del programa..." << std::endl;
            break;
        } else {
            std::cout << "Opción inválida, intente de nuevo." << std::endl;
            system("pause");
        }
    }

    system("pause");
    return 0;
}

