## 2.6 Instalação do MySQL usando Unbreakable Linux Network (ULN)

O Linux suporta várias soluções diferentes para instalar o MySQL, conforme descrito na Seção 2.5, “Instalando o MySQL no Linux”. Um dos métodos, descrito nesta seção, é a instalação a partir da Oracle Unbreakable Linux Network (ULN). Você pode encontrar informações sobre o Oracle Linux e a ULN em <http://linux.oracle.com/>.

Para usar o ULN, você precisa obter um login ULN e registrar a máquina usada para a instalação com o ULN. Isso é descrito em detalhes na [FAQ do ULN](https://linux.oracle.com/uln_faq.html). A página também descreve como instalar e atualizar pacotes. Os pacotes do MySQL estão nos canais “MySQL para Oracle Linux 6” e “MySQL para Oracle Linux 7” para a arquitetura do seu sistema no ULN.

Nota

A ULN fornece o MySQL 5.7 para o Oracle Linux 6 e o Oracle Linux 7. Alternativamente, o Oracle Linux 8 suporta o MySQL 8.0. Além disso, os pacotes Enterprise estão disponíveis a partir do MySQL 8.0.21.

Depois que o MySQL foi instalado usando o ULN, você pode encontrar informações sobre como iniciar e parar o servidor, entre outras coisas, nesta seção, especificamente na Seção 2.5.5, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle”.

Se você estiver mudando a fonte do pacote para usar o ULN e não estiver mudando a versão do MySQL que está usando, faça um backup dos seus dados, remova os binários existentes e substitua-os pelos do ULN. Se houver uma mudança na versão, recomendamos que o backup seja um dump (**mysqldump** ou **mysqlpump** ou do utilitário de backup do MySQL Shell) por precaução, caso você precise reconstruir seus dados depois que os novos binários estiverem instalados. Se essa mudança para o ULN cruzar uma fronteira de versão, consulte esta seção antes de prosseguir: Seção 2.10, “Atualização do MySQL”.
