#include <iostream>

using namespace std;

struct User {
    string user_name;
    string user_password;
};

bool login(string user_name, string password) {
    
    
    const int size = 500;
    
    User users[size] = {
        {"User1", "user1password"},
        {"User2", "user2password"},
        {"User3", "user3password"},
        {"admin", "adminpassword"}
    };


    for (int i = 0; i < size; i++) {
        if (users[i].user_name == user_name && users[i].user_password == password) {
            cout << "¡Bienvenido/a " << user_name << "!" << endl;
            return true;
        };
    };

    cout << "Usuario y/o contraseña incorrecta" << endl;
    return false;
}

int main() {
    string user_name, user_password;
    bool verification;
    int tries = 0;

    cout << "Gestor de pedidos" << endl;
    cout << "Inicio de sesión" << endl;

    do {
        cout << "Ingrese nombre de Usuario: ";
        cin >> user_name;
        cout << "Ingrese su Contraseña: ";
        cin >> user_password;

        verification = login(user_name, user_password);

        if (!verification) {
            tries++;
            cout << "Intento " << tries << " de 3." << endl;
        }

    } while (!verification && tries < 3);

    if (!verification) {
        cout << "Usuario bloqueado. Contacte con el administrador." << endl;
    }

    system("pause");
    return 0;
}
