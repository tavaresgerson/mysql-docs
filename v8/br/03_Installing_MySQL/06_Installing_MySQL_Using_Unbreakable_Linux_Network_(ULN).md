## 2.6 Instalar o MySQL usando Unbreakable Linux Network (ULN)

O Linux suporta várias soluções diferentes para instalar o MySQL, conforme descrito na Seção 2.5, “Instalando MySQL no Linux”. Um dos métodos, descrito nesta seção, é instalar a partir da Oracle Unbreakable Linux Network (ULN). Você pode encontrar informações sobre o Oracle Linux e ULN em <http://linux.oracle.com/>.

Para usar o ULN, você precisa obter um login ULN e registrar a máquina usada para a instalação com o ULN. Isso é descrito em detalhes na [FAQ do ULN][(https://linux.oracle.com/uln_faq.html)]. A página também descreve como instalar e atualizar pacotes.

Ambos os pacotes comunitários e comerciais são suportados, e cada um oferece três canais MySQL:

* `Server`: MySQL Server
* `Connectors`: MySQL Connector/C++, MySQL Connector/J, MySQL Connector/ODBC e MySQL Connector/Python.

* `Tools`: Roteador MySQL, Shell MySQL e MySQL Workbench

Os canais da Comunidade estão disponíveis para todos os usuários da ULN.

Para acessar os pacotes comerciais de ULN MySQL em oracle.linux.com, você precisa fornecer um CSI com uma licença comercial válida para MySQL (Enterprise ou Standard). Até a data desta publicação, as compras válidas são 60944, 60945, 64911 e 64912. O CSI apropriado disponibiliza os canais de assinatura comercial do MySQL na interface da sua ULN.

Uma vez que o MySQL foi instalado usando o ULN, você pode encontrar informações sobre como iniciar e parar o servidor, e mais, na Seção 2.5.7, “Instalando MySQL no Linux a partir dos Repositórios de Software Nativo”, particularmente na Seção 2.5.4, “Instalando MySQL no Linux Usando Pacotes RPM da Oracle”.

Se você estiver mudando a fonte do pacote para usar ULN e não estiver mudando a versão do MySQL que está usando, faça um backup dos seus dados, remova os binários existentes e substitua-os pelos da ULN. Se houver uma mudança na versão, recomendamos que o backup seja um dump (**mysqldump** ou **mysqlpump** ou do utilitário de backup do MySQL Shell](/doc/mysql-shell/8.0/en/mysql-shell-utilities-dump-instance-schema.html)) apenas por precaução, caso você precise reconstruir seus dados depois que os novos binários estiverem no lugar. Se essa mudança para ULN atravessar uma fronteira de versão, consulte esta seção antes de prosseguir: Capítulo 3, *Atualizando o MySQL*.

Nota

O Oracle Linux 8 é suportado a partir do MySQL 8.0.17, e os canais de Ferramentas e Conectadores da comunidade foram adicionados com o lançamento do MySQL 8.0.24.