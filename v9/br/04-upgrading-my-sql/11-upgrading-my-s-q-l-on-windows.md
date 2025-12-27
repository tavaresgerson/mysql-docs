## 3.11 Atualizando o MySQL no Windows

Para atualizar o MySQL no Windows, você pode baixar e executar o arquivo MSI mais recente do MySQL Server ou usar a distribuição do arquivo ZIP do Windows.

Observação

Ao contrário do MySQL 9.5, o MySQL 8.0 usa o MySQL Installer para instalar e atualizar o MySQL Server, juntamente com a maioria dos outros produtos MySQL; no entanto, o MySQL Installer não está disponível para o MySQL 8.1 e versões superiores. No entanto, a funcionalidade de configuração usada no MySQL Installer está disponível a partir do MySQL 8.1, usando a Seção 2.3.2, “Configuração: Usando o Configurador MySQL” que vem com o arquivo MSI e o ZIP.

A abordagem que você selecionar depende de como a instalação existente foi realizada. Antes de prosseguir, revise o Capítulo 3, *Atualizando o MySQL* para obter informações adicionais sobre a atualização do MySQL que não são específicas do Windows.

### Atualizando o MySQL com o MSI

Baixe e execute o arquivo MSI mais recente. Embora a atualização entre as séries de lançamento não seja diretamente suportada, a opção "Configuração Personalizada" permite definir um local de instalação, pois caso contrário, o MSI será instalado no local padrão, como `C:\Program Files\MySQL\MySQL Server 9.5\`.

Execute o Configurador MySQL para configurar sua instalação.

### Atualizando o MySQL Usando a Distribuição do Arquivo ZIP do Windows

Para realizar uma atualização usando a distribuição do arquivo ZIP do Windows:

1. Baixe a mais recente distribuição do arquivo ZIP do MySQL do Windows em <https://dev.mysql.com/downloads/>.

2. Se o servidor estiver em execução, pare-o. Se o servidor estiver instalado como serviço, pare o serviço com o seguinte comando do prompt de comando:

   ```
   C:\> SC STOP mysqld_service_name
   ```

   Alternativamente, use **NET STOP *`mysqld_service_name`*** .

Se você não estiver executando o servidor MySQL como um serviço, use **mysqladmin** para interromper o serviço. Por exemplo, antes de fazer a atualização do MySQL 9.4 para 9.5, use **mysqladmin** do MySQL 9.4 da seguinte forma:

```
   C:\> "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysqladmin" -u root shutdown
   ```

Observação

Se a conta de usuário `root` do MySQL tiver uma senha, inicie **mysqladmin** com a opção `-p` e insira a senha quando solicitado.

3. Extraia o arquivo ZIP. Você pode substituir a instalação existente do MySQL (geralmente localizada em `C:\mysql`) ou instalá-la em um diretório diferente, como `C:\mysql8`. Substituir a instalação existente é recomendado.

4. Reinicie o servidor. Por exemplo, use o comando **SC START *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`*** se você estiver executando o MySQL como um serviço, ou inicie o **mysqld** diretamente caso contrário.

5. Se você encontrar erros, consulte a Seção 2.3.4, “Soluções de problemas de instalação do MySQL Server da Microsoft Windows”.