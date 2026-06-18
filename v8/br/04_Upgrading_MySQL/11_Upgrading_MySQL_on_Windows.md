## 3.11 Atualização do MySQL no Windows

Existem duas abordagens para atualizar o MySQL no Windows:

- Usando o Instalador do MySQL
- Usando a distribuição de arquivos ZIP do Windows

A abordagem que você selecionar depende de como a instalação existente foi realizada. Antes de prosseguir, revise o Capítulo 3, *Atualizando o MySQL*, para obter informações adicionais sobre a atualização do MySQL que não são específicas do Windows.

Nota

Independentemente da abordagem que você escolher, sempre faça um backup da sua instalação atual do MySQL antes de realizar uma atualização. Veja a Seção 9.2, “Métodos de Backup de Banco de Dados”.

As atualizações entre versões não GA (ou de uma versão não GA para uma versão GA) não são suportadas. Alterações significativas de desenvolvimento ocorrem em versões não GA e você pode encontrar problemas de compatibilidade ou problemas ao iniciar o servidor.

Nota

O Instalador do MySQL não suporta atualizações entre as versões *Community* e as versões *Comerciais*. Se você precisar fazer esse tipo de atualização, faça-a usando a abordagem de arquivo ZIP.

### Atualizando o MySQL com o Instalador do MySQL

Realizar uma atualização com o Instalador do MySQL é a melhor abordagem quando a instalação atual do servidor foi realizada com ele e a atualização está dentro da série de lançamentos atuais. O Instalador do MySQL não suporta atualizações entre séries de lançamentos, como de 5.7 para 8.0, e não fornece um indicador de atualização para avisá-lo sobre a necessidade de atualização. Para obter instruções sobre a atualização entre séries de lançamentos, consulte Atualizando o MySQL Usando a Distribuição ZIP do Windows.

Para realizar uma atualização usando o Instalador do MySQL:

1. Inicie o Instalador do MySQL.

2. No painel de controle, clique em Catálogo para fazer o download das últimas alterações no catálogo. O servidor instalado só pode ser atualizado se o painel de controle exibir uma seta ao lado do número da versão do servidor.

3. Clique em Atualizar. Todos os produtos que têm uma versão mais recente agora aparecem em uma lista.

   Nota

   O Instalador do MySQL desmarca a opção de atualização do servidor para versões de marco (Pré-Lançamento) da mesma série de lançamento. Além disso, ele exibe uma mensagem de aviso para indicar que a atualização não é suportada, identifica os riscos de continuar e fornece um resumo dos passos para realizar uma atualização manualmente. Você pode remarcar a atualização do servidor e prosseguir por sua conta e risco.

4. Desmarque todos os produtos, exceto o do servidor MySQL, a menos que você pretenda atualizar outros produtos neste momento, e clique em Próximo.

5. Clique em Executar para iniciar o download. Quando o download terminar, clique em Próximo para iniciar a operação de atualização.

   As atualizações para o MySQL 8.0.16 e versões superiores podem exibir uma opção para pular a verificação de atualização e o processo para as tabelas do sistema. Para obter mais informações sobre essa opção, consulte Condições importantes de atualização do servidor.

6. Configure o servidor.

### Atualizando o MySQL usando a distribuição ZIP do Windows

Para realizar uma atualização usando a distribuição de arquivo ZIP do Windows:

1. Baixe a última distribuição de Arquivo ZIP do MySQL para Windows em <https://dev.mysql.com/downloads/>.

2. Se o servidor estiver em execução, pare-o. Se o servidor estiver instalado como um serviço, pare o serviço com o seguinte comando do prompt de comando:

   ```
   C:\> SC STOP mysqld_service_name
   ```

   Alternativamente, use **NET STOP `mysqld_service_name`**.

   Se você não estiver executando o servidor MySQL como um serviço, use **mysqladmin** para interromper o serviço. Por exemplo, antes de fazer a atualização do MySQL 5.7 para 8.0, use **mysqladmin** do MySQL 5.7 da seguinte forma:

   ```
   C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqladmin" -u root shutdown
   ```

   Nota

   Se a conta de usuário MySQL `root` tiver uma senha, invocando o **mysqladmin** com a opção `-p` e inserindo a senha quando solicitado.

3. Extraia o arquivo ZIP. Você pode substituir a instalação MySQL existente (geralmente localizada em `C:\mysql`) ou instalá-la em um diretório diferente, como `C:\mysql8`. Recomenda-se substituir a instalação existente.

4. Reinicie o servidor. Por exemplo, use o comando **SC START `mysqld_service_name`** ou **NET START `mysqld_service_name`** se você estiver executando o MySQL como um serviço, ou invocando diretamente o **mysqld**.

5. Antes do MySQL 8.0.16, execute **mysql\_upgrade** como Administrador para verificar suas tabelas, tentar repará-las, se necessário, e atualizar suas tabelas de concessão se elas tiverem sido alteradas, para que você possa aproveitar quaisquer novas funcionalidades. Veja a Seção 6.4.5, “mysql\_upgrade — Verificar e Atualizar Tabelas do MySQL”. A partir do MySQL 8.0.16, essa etapa não é necessária, pois o servidor realiza todas as tarefas anteriormente tratadas pelo **mysql\_upgrade**.

6. Se você encontrar erros, consulte a Seção 2.3.5, “Solução de problemas de instalação do Microsoft Windows MySQL Server”.
