## 2.6 Instalação do MySQL usando a Unbreakable Linux Network (ULN)

O Linux suporta uma série de soluções diferentes para instalar o MySQL, coberto na Seção 2.5, Instalar o MySQL no Linux. Um dos métodos, coberto nesta seção, é instalar a partir da Unbreakable Linux Network (ULN) da Oracle. Você pode encontrar informações sobre o Oracle Linux e o ULN em \[<http://linux.oracle.com/>]<http://linux.oracle.com/>.

Para usar o ULN, você precisa obter um login do ULN e registrar a máquina usada para a instalação com o ULN. Isso é descrito em detalhes nas FAQ do ULN. A página também descreve como instalar e atualizar pacotes.

Ambos os pacotes Comunitário e Comercial são suportados, e cada um oferece três canais MySQL:

- `Server`: Servidor MySQL
- `Connectors`: MySQL Connector/C++, MySQL Connector/J, MySQL Connector/ODBC e MySQL Connector/Python.
- `Tools`: Roteador MySQL, Shell MySQL e Banco de Trabalho MySQL

Os canais comunitários estão disponíveis para todos os utilizadores da ULN.

Para acessar pacotes comerciais do MySQL ULN no oracle.linux.com é necessário fornecer um CSI com uma licença comercial válida para o MySQL (Enterprise ou Standard).

Uma vez que o MySQL foi instalado usando o ULN, você pode encontrar informações sobre como iniciar e parar o servidor, e mais, na Seção 2.5.7, Instalar o MySQL no Linux a partir dos Repositórios de Software Nativo, particularmente na Seção 2.5.4, Instalar o MySQL no Linux Usando Pacotes RPM do Oracle.

Se você estiver mudando sua fonte de pacote para usar o ULN e não alterar a compilação do MySQL que você está usando, faça o backup de seus dados, remova seus binários existentes e substitua-os com os da ULN. Se uma mudança de compilação estiver envolvida, recomendamos que o backup seja um dump (de `mysqldump` ou o utilitário de backup do MySQL Shell) caso você precise reconstruir seus dados depois que os novos binários estiverem no lugar. Se essa mudança para o ULN cruzar um limite de versão, consulte esta seção antes de prosseguir: Capítulo 3, *Atualização do MySQL*.
