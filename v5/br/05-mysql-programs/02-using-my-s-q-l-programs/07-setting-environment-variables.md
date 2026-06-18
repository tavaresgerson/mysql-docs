### 4.2.7 Definindo variáveis de ambiente

As variáveis de ambiente podem ser definidas no prompt de comando para afetar a invocação atual do seu processador de comandos ou definidas permanentemente para afetar invocações futuras. Para definir uma variável permanentemente, você pode defini-la em um arquivo de inicialização ou usando a interface fornecida pelo seu sistema para esse propósito. Consulte a documentação do seu interpretador de comandos para detalhes específicos. A seção 4.9, “Variáveis de Ambiente”, lista todas as variáveis de ambiente que afetam o funcionamento do programa MySQL.

Para especificar um valor para uma variável de ambiente, use a sintaxe apropriada para o seu processador de comandos. Por exemplo, no Windows, você pode definir a variável `USER` para especificar o nome da sua conta MySQL. Para fazer isso, use a seguinte sintaxe:

```sql
SET USER=your_name
```

A sintaxe no Unix depende do seu shell. Suponha que você queira especificar o número da porta TCP/IP usando a variável `MYSQL_TCP_PORT`. A sintaxe típica (como para **sh**, **ksh**, **bash**, **zsh**, e assim por diante) é a seguinte:

```sql
MYSQL_TCP_PORT=3306
export MYSQL_TCP_PORT
```

O primeiro comando define a variável, e o comando `export` exporta a variável para o ambiente do shell, de modo que seu valor se torne acessível ao MySQL e a outros processos.

Para **csh** e **tcsh**, use **setenv** para tornar a variável do shell disponível no ambiente:

```sql
setenv MYSQL_TCP_PORT 3306
```

Os comandos para definir variáveis de ambiente podem ser executados no prompt de comando para entrar em vigor imediatamente, mas as configurações persistem apenas até você fazer o logout. Para que as configurações entrem em vigor a cada login, use a interface fornecida pelo seu sistema ou coloque o comando ou os comandos apropriados em um arquivo de inicialização que o interpretador de comandos lê a cada vez que ele é iniciado.

No Windows, você pode definir variáveis de ambiente usando o Painel de Controle do Sistema (em Avançado).

No Unix, os arquivos de inicialização típicos do shell são `.bashrc` ou `.bash_profile` para o **bash**, ou `.tcshrc` para o **tcsh**.

Suponha que seus programas MySQL estejam instalados em `/usr/local/mysql/bin` e que você queira facilitar o acesso a esses programas. Para fazer isso, defina o valor da variável de ambiente `PATH` para incluir esse diretório. Por exemplo, se seu shell for **bash**, adicione a seguinte linha ao seu arquivo `.bashrc`:

```sql
PATH=${PATH}:/usr/local/mysql/bin
```

O **bash** usa arquivos de inicialização diferentes para shells de login e não-login, então você pode querer adicionar a configuração ao `.bashrc` para shells de login e ao `.bash_profile` para shells não-login para garantir que o `PATH` seja definido independentemente.

Se o seu shell for **tcsh**, adicione a seguinte linha ao seu arquivo `.tcshrc`:

```sql
setenv PATH ${PATH}:/usr/local/mysql/bin
```

Se o arquivo de inicialização apropriado não existir no seu diretório de casa, crie-o com um editor de texto.

Depois de modificar a configuração do `PATH`, abra uma nova janela do console no Windows ou faça login novamente no Unix para que a configuração entre em vigor.
