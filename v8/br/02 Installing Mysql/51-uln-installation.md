## 2.6 Instalando o MySQL usando a Rede Linux Inquebrável (ULN)

O Linux suporta várias soluções diferentes para instalar o MySQL, conforme descrito na Seção 2.5, “Instalando o MySQL no Linux”. Um dos métodos, abordado nesta seção, é a instalação a partir da Rede Linux Inquebrável (ULN) da Oracle. Você pode encontrar informações sobre o Oracle Linux e a ULN em <http://linux.oracle.com/>.

Para usar a ULN, você precisa obter um login da ULN e registrar a máquina usada para a instalação na ULN. Isso é descrito em detalhes nas Perguntas Frequentes da ULN. A página também descreve como instalar e atualizar pacotes.

Os pacotes da Comunidade e Comerciais são suportados, e cada um oferece três canais do MySQL:

* `Server`: MySQL Server
* `Connectors`: MySQL Connector/C++, MySQL Connector/J, MySQL Connector/ODBC e MySQL Connector/Python.
* `Tools`: MySQL Router, MySQL Shell e MySQL Workbench

Os canais da Comunidade estão disponíveis para todos os usuários da ULN.

Para acessar os pacotes comerciais do MySQL ULN em oracle.linux.com, você precisa fornecer um CSI com uma licença comercial válida para o MySQL (Enterprise ou Standard). Até a data desta escrita, as compras válidas são 60944, 60945, 64911 e 64912. O CSI apropriado torna os canais de assinatura do MySQL comercial disponíveis na interface da GUI da ULN.

Uma vez que o MySQL foi instalado usando a ULN, você pode encontrar informações sobre como iniciar e parar o servidor, entre outros, na Seção 2.5.7, “Instalando o MySQL no Linux a partir dos Repositórios de Software Nativo”, particularmente na Seção 2.5.4, “Instalando o MySQL no Linux usando pacotes RPM da Oracle”.

Se você estiver mudando a fonte do pacote para usar o ULN e não estiver mudando a versão do MySQL que está usando, faça um backup dos seus dados, remova os binários existentes e substitua-os pelos do ULN. Se envolver uma mudança de versão, recomendamos que o backup seja um dump (do `mysqldump` ou do utilitário de backup do MySQL Shell) por precaução, caso você precise reconstruir seus dados depois que os novos binários estiverem instalados. Se essa mudança para o ULN atravessar uma fronteira de versão, consulte esta seção antes de prosseguir: Capítulo 3, *Atualizando o MySQL*.