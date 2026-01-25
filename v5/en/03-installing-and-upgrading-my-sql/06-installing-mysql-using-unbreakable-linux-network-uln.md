## 2.6 Instalando MySQL Usando Unbreakable Linux Network (ULN)

O Linux suporta várias soluções diferentes para instalar o MySQL, abordadas na Seção 2.5, “Instalando MySQL no Linux”. Um dos métodos, coberto nesta seção, é a instalação a partir do Unbreakable Linux Network (ULN) da Oracle. Você pode encontrar informações sobre o Oracle Linux e o ULN em <http://linux.oracle.com/>.

Para usar o ULN, você precisa obter um login no ULN e registrar a máquina usada para a instalação no ULN. Isso é descrito em detalhes no [ULN FAQ](https://linux.oracle.com/uln_faq.html). A página também descreve como instalar e atualizar packages. Os packages do MySQL estão nos "channels" “MySQL for Oracle Linux 6” e “MySQL for Oracle Linux 7” para a architecture do seu sistema no ULN.

Nota

O ULN fornece o MySQL 5.7 para o Oracle Linux 6 e Oracle Linux 7. Alternativamente, o Oracle Linux 8 suporta o MySQL 8.0. Além disso, packages Enterprise estão disponíveis a partir do MySQL 8.0.21.

Após o MySQL ser instalado usando o ULN, você pode encontrar informações sobre como iniciar e parar o server, e mais, nesta seção, particularmente na Seção 2.5.5, “Instalando MySQL no Linux Usando Packages RPM da Oracle”.

Se você estiver mudando sua fonte de packages para usar o ULN e não estiver alterando qual build do MySQL você está utilizando, faça um backup dos seus dados, remova seus binaries existentes e substitua-os pelos do ULN. Se uma mudança de build estiver envolvida, recomendamos que o backup seja um dump (**mysqldump** ou **mysqlpump** ou a partir da backup utility do MySQL Shell) caso você precise reconstruir seus dados após os novos binaries estarem instalados. Se essa mudança para o ULN cruzar um limite de versão, consulte esta seção antes de prosseguir: Seção 2.10, “Upgrading MySQL”.