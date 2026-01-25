### 2.10.8 Atualizando o MySQL no Windows

Existem duas abordagens para fazer o *upgrade* do MySQL no Windows:

* Usando o MySQL Installer
* Usando a distribuição Windows ZIP archive

A abordagem que você selecionar depende de como a instalação existente foi realizada. Antes de prosseguir, revise a Seção 2.10, “Upgrading MySQL” para obter informações adicionais sobre a atualização do MySQL que não são específicas do Windows.

Nota

Seja qual for a abordagem escolhida, sempre faça *backup* de sua instalação atual do MySQL antes de realizar um *upgrade*. Consulte a Seção 7.2, “Database Backup Methods”.

*Upgrades* entre *milestone releases* (ou de uma *milestone release* para uma *GA release* - General Availability) não são suportados. Mudanças significativas de desenvolvimento ocorrem nas *milestone releases*, e você pode encontrar problemas de compatibilidade ou problemas ao iniciar o *Server*. Para instruções sobre como realizar um *logical upgrade* com uma *milestone release*, consulte *Logical Upgrade*.

Nota

O MySQL Installer não suporta *upgrades* entre *Community releases* e *Commercial releases*. Se você precisar desse tipo de *upgrade*, realize-o usando a abordagem do *ZIP archive*.

#### Atualizando MySQL com o MySQL Installer

Realizar um *upgrade* com o MySQL Installer é a melhor abordagem quando a instalação atual do *Server* foi feita com ele e o *upgrade* está dentro da série de *release* atual. O MySQL Installer não suporta *upgrades* entre séries de *release*, como de 5.6 para 5.7, e não fornece um indicador de *upgrade* para alertá-lo a atualizar. Para instruções sobre como fazer *upgrade* entre séries de *release*, consulte Upgrading MySQL Using the Windows ZIP Distribution.

Para realizar um *upgrade* usando o MySQL Installer:

1. Inicie o MySQL Installer.
2. No *Dashboard*, clique em Catalog para baixar as alterações mais recentes no *catalog*. O *Server* instalado pode ser atualizado somente se o *Dashboard* exibir uma seta ao lado do número da versão do *Server*.

3. Clique em Upgrade. Todos os produtos que possuem uma versão mais recente agora aparecem em uma lista.

   Nota

   O MySQL Installer desmarca a opção de *server upgrade* para *milestone releases* (Pré-Release) na mesma série de *release*. Além disso, ele exibe um aviso para indicar que o *upgrade* não é suportado, identifica os riscos de prosseguir e fornece um resumo das etapas para realizar um *logical upgrade* manualmente. Você pode selecionar novamente o *server upgrade* e prosseguir por sua conta e risco.

4. Desmarque todos, exceto o produto MySQL *Server*, a menos que você pretenda atualizar outros produtos neste momento, e clique em Next.

5. Clique em Execute para iniciar o *download*. Quando o *download* terminar, clique em Next para iniciar a operação de *upgrade*.

6. Configure o *Server*.

#### Atualizando MySQL Usando a Distribuição Windows ZIP

Para realizar um *upgrade* usando a distribuição Windows ZIP archive:

1. Baixe a distribuição Windows ZIP Archive mais recente do MySQL em <https://dev.mysql.com/downloads/>.

2. Se o *Server* estiver em execução, pare-o. Se o *Server* estiver instalado como um *Service*, pare o *Service* com o seguinte comando no *command prompt*:

   ```sql
   C:\> SC STOP mysqld_service_name
   ```

   Alternativamente, use **NET STOP *`mysqld_service_name`***.

   Se você não estiver executando o MySQL *Server* como um *Service*, use o **mysqladmin** para pará-lo. Por exemplo, antes de fazer o *upgrade* do MySQL 5.6 para 5.7, use o **mysqladmin** do MySQL 5.6 da seguinte forma:

   ```sql
   C:\> "C:\Program Files\MySQL\MySQL Server 5.6\bin\mysqladmin" -u root shutdown
   ```

   Nota

   Se a conta de usuário `root` do MySQL tiver uma senha, invoque o **mysqladmin** com a opção `-p` e digite a senha quando solicitado.

3. Extraia o ZIP archive. Você pode sobrescrever sua instalação existente do MySQL (geralmente localizada em `C:\mysql`) ou instalá-lo em um diretório diferente, como `C:\mysql5`. Recomenda-se sobrescrever a instalação existente.

4. Reinicie o *Server*. Por exemplo, use o comando **SC START *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`*** se você executa o MySQL como um *Service*, ou invoque **mysqld** diretamente caso contrário.

5. Como *Administrator*, execute **mysql_upgrade** para verificar suas *tables*, tentar repará-las se necessário e atualizar suas *grant tables* se elas tiverem sido alteradas, para que você possa aproveitar quaisquer novos recursos. Consulte a Seção 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables”.

6. Se você encontrar *errors*, consulte a Seção 2.3.5, “Troubleshooting a Microsoft Windows MySQL Server Installation”.
