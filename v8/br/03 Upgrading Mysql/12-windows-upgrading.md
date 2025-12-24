## 3.11 Atualização do MySQL no Windows

Para atualizar o MySQL no Windows, baixe e execute o mais recente MSI do MySQL Server ou use a distribuição de arquivo ZIP do Windows.

::: info Note

Ao contrário do MySQL 8.4, o MySQL 8.0 usa o MySQL Installer para instalar e atualizar o MySQL Server junto com a maioria dos outros produtos do MySQL; mas o MySQL Installer não está disponível com o MySQL 8.1 e superior.

:::

A abordagem que você selecionar depende de como a instalação existente foi realizada. Antes de prosseguir, revise o Capítulo 3, \* Atualização do MySQL \* para obter informações adicionais sobre a atualização do MySQL que não é específica do Windows.

### Atualização do MySQL com o MSI

Baixe e execute o MSI mais recente. Embora a atualização entre séries de versões não seja diretamente suportada, a opção "Configuração personalizada" permite definir um local de instalação, pois de outra forma o MSI instala no local padrão, como `C:\Program Files\MySQL\MySQL Server 8.4\`.

Execute o MySQL Configurator para configurar a sua instalação.

### Atualização do MySQL usando a distribuição Windows ZIP

Para realizar uma atualização usando a distribuição de arquivo ZIP do Windows:

1. Baixe a mais recente distribuição de arquivo Windows ZIP do MySQL em \[<https://dev.mysql.com/downloads/]{><https://dev.mysql.com/downloads/}>.

2. Se o servidor estiver em execução, pare-o. Se o servidor estiver instalado como um serviço, pare o serviço com o seguinte comando do prompt de comandos:

   ```
   C:\> SC STOP mysqld_service_name
   ```

   Alternativamente, use `NET STOP mysqld_service_name`.

   Se você não estiver executando o servidor MySQL como um serviço, use `mysqladmin` para pará-lo. Por exemplo, antes de atualizar do MySQL 8.3 para 8.4, use `mysqladmin` do MySQL 8.3 da seguinte forma:

   ```
   C:\> "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysqladmin" -u root shutdown
   ```

   ::: info Note

   Se a conta de usuário MySQL `root` tiver uma senha, invoque `mysqladmin` com a opção `-p` e insira a senha quando solicitada.

   :::

3. Extrair o arquivo ZIP. Você pode substituir sua instalação MySQL existente (geralmente localizada em `C:\mysql`), ou instalá-lo em um diretório diferente, como `C:\mysql8`. É recomendado substituir a instalação existente.

4. Reinicie o servidor. Por exemplo, use o comando `SC START mysqld_service_name` ou `NET START mysqld_service_name` se você executar o MySQL como um serviço, ou invoque diretamente o `mysqld` caso contrário.

5. Se encontrar erros, consulte a Secção 2.3.4, "Solução de problemas de uma instalação do Microsoft Windows MySQL Server".
