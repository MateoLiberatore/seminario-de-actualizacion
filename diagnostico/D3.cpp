#include <iostream>
#include <string>
#include <cctype>


const int total = 500;
std::string log_name;
std::string log_password;

struct User {
    std::string user_name;
    std::string user_password;
};

User users[total] = {
    {"User1", "user1password"},
    {"User2", "user2password"},
    {"User3", "user3password"},
    {"admin", "adminpassword"}
};
 
void login();
void password_mod();
bool pass_verification(std::string password);

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
                    std::cout << "Contraseña cambiada correctamente.\n";
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
    
    system("color E0");
    int option;
    std::cout << "Gestor de pedidos" << std::endl;

    login();

    while(true){
        system("pause");
        std::cout << "1. Cambiar contraseña" << std::endl;
        std::cout << "2. Salir" << std::endl;
        std::cout << "Seleccione una opción: ";
        std::cin >> option;

      switch (option) {
      case 1: password_mod();
          break;
      case 2: 
          std::cout << "Saliendo del programa... " << std::endl;
          return 0;
      default:
          std::cout<< "opcion invalida, intente de nuevo."<< std::endl;
          break;
      };
  };

    system("pause");
    return 0;
};
