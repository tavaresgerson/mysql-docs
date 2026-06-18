## 2.6 Instalação do MySQL usando Unbreakable Linux Network (ULN)

O Linux suporta várias soluções diferentes para instalar o MySQL, conforme descrito na Seção 2.5, “Instalando o MySQL no Linux”. Um dos métodos, descrito nesta seção, é a instalação a partir da Oracle Unbreakable Linux Network (ULN). Você pode encontrar informações sobre o Oracle Linux e a ULN em <http://linux.oracle.com/>.

Para usar o ULN, você precisa obter um login ULN e registrar a máquina usada para a instalação com o ULN. Isso é descrito em detalhes na FAQ do ULN. A página também descreve como instalar e atualizar pacotes.

Ambos os pacotes comunitários e comerciais são suportados, e cada um oferece três canais do MySQL:

- `Server`: Servidor MySQL

- `Connectors`: MySQL Connector/C++, MySQL Connector/J, MySQL Connector/ODBC e MySQL Connector/Python.

- `Tools`: Roteador MySQL, Shell MySQL e MySQL Workbench

Os canais da Comunidade estão disponíveis para todos os usuários da ULN.

Para acessar os pacotes comerciais de MySQL ULN no oracle.linux.com, você precisa fornecer um CSI com uma licença comercial válida para o MySQL (Enterprise ou Standard). Até a data desta publicação, as compras válidas são 60944, 60945, 64911 e 64912. O CSI apropriado disponibiliza os canais de assinatura comercial do MySQL na interface da sua GUI ULN.

Depois que o MySQL foi instalado usando o ULN, você pode encontrar informações sobre como iniciar e parar o servidor, entre outras coisas, na Seção 2.5.7, “Instalando o MySQL no Linux a partir dos Repositórios de Software Nativo”, especificamente na Seção 2.5.4, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle”.

Se você estiver mudando a fonte do pacote para usar o ULN e não estiver mudando a versão do MySQL que está usando, faça um backup dos seus dados, remova os binários existentes e substitua-os pelos do ULN. Se houver uma mudança na versão, recomendamos que o backup seja um dump (**mysqldump** ou **mysqlpump** ou do utilitário de backup do MySQL Shell) por precaução, caso você precise reconstruir seus dados depois que os novos binários estiverem instalados. Se essa mudança para o ULN cruzar uma fronteira de versão, consulte esta seção antes de prosseguir: Capítulo 3, *Atualizando o MySQL*.

Nota

O Oracle Linux 8 é suportado a partir do MySQL 8.0.17, e os canais de Ferramentas e Conectores da comunidade foram adicionados com o lançamento do MySQL 8.0.24.
