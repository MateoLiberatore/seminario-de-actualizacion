#include <iostream>
#include <string>

const int total = 500;
bool verification;
std::string user_name, user_password;// when login 

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


void password_mod(){

    std::string option;
    std::string new_pass;
    bool success;
    int tries = 0;
    
    
    while (tries < 3){         
        system("cls");
        std::cout << "Modificacion de Contraseña" << std::endl;
        std::cout << "1.Cambiar Contraseña" << std::endl;
        std::cout << "X.Salir" << std::endl;
        std::cout << "Seleccione una opción: ";
        std::cin >> option ;

        if(option == "1"){
            system("cls");
            std::cout << "ingrese nueva contraseña:";
            std::cin >> new_pass;   

            if (new_pass.empty()){
                tries++;
                std::cout << "no se permiten contraseñas vacias" << std::endl; 
                std::cout << "Intento " << tries << " de 3." << std::endl;
            } else {
                for (int i = 0; i < total; i++) {
                    if (users[i].user_name == user_name) {
                        users[i].user_password = new_pass;
                        break;
                    }
            }
                success = true;
                std::cout << "Contraseña cambiada correctamente.\n";
                return;
            }
        } else if (option == "x" || option == "X"){
            std::cout << "saliendo del menu" << std:: endl;
            return ;
        } else {
            tries++;
            std::cout << "opcion invalida. Intento: " << tries << " de 3." << std::endl;
        };

    };
    std::cout << "No se pudo cambiar la contraseña. Alcanzo el limite de intentos." << std::endl;
    login();
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
                verification = true;
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
