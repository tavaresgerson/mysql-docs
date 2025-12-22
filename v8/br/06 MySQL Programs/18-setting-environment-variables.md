### 6.2.9 Definição de variáveis ambientais

As variáveis de ambiente podem ser definidas no prompt de comando para afetar a invocação atual do seu processador de comando, ou definidas permanentemente para afetar invocações futuras. Para definir uma variável permanentemente, você pode configurá-la em um arquivo de inicialização ou usando a interface fornecida pelo seu sistema para esse fim. Consulte a documentação para o seu interpretador de comandos para detalhes específicos. Seção 6.9, "Variáveis de ambiente", lista todas as variáveis de ambiente que afetam a operação do programa MySQL.

Para especificar um valor para uma variável de ambiente, use a sintaxe apropriada para o seu processador de comandos. Por exemplo, no Windows, você pode definir a variável `USER` para especificar o nome da sua conta MySQL. Para isso, use esta sintaxe:

```
SET USER=your_name
```

A sintaxe no Unix depende do seu shell. Suponha que você queira especificar o número de porta TCP/IP usando a variável `MYSQL_TCP_PORT`. A sintaxe típica (como para **sh**, **ksh**, **bash**, **zsh**, e assim por diante) é a seguinte:

```
MYSQL_TCP_PORT=3306
export MYSQL_TCP_PORT
```

O primeiro comando define a variável, e o comando `export` exporta a variável para o ambiente do shell para que seu valor se torne acessível ao MySQL e a outros processos.

Para **csh** e **tcsh**, use **setenv** para disponibilizar a variável do invólucro ao ambiente:

```
setenv MYSQL_TCP_PORT 3306
```

Os comandos para definir variáveis de ambiente podem ser executados no prompt de comandos para entrar em vigor imediatamente, mas as configurações persistem apenas até que você faça o log-out. Para que as configurações entrem em vigor a cada vez que você fizer o log-in, use a interface fornecida pelo seu sistema ou coloque o comando ou comandos apropriados em um arquivo de inicialização que seu interpretador de comandos lê a cada vez que ele é iniciado.

No Windows, você pode definir variáveis de ambiente usando o Painel de Controle do Sistema (em Avançado).

No Unix, arquivos de inicialização de shell típicos são `.bashrc` ou `.bash_profile` para **bash**, ou `.tcshrc` para **tcsh**.

Suponha que seus programas MySQL estejam instalados no `/usr/local/mysql/bin` e que você queira facilitar a invocação desses programas. Para fazer isso, defina o valor da variável de ambiente `PATH` para incluir esse diretório. Por exemplo, se seu shell é **bash**, adicione a seguinte linha ao seu `.bashrc` arquivo:

```
PATH=${PATH}:/usr/local/mysql/bin
```

**bash** usa arquivos de inicialização diferentes para shells de login e não-login, então você pode adicionar a configuração para `.bashrc` para shells de login e para `.bash_profile` para shells não-login para garantir que `PATH` seja definido independentemente.

Se o seu shell é **tcsh**, adicione a seguinte linha ao seu arquivo `.tcshrc`:

```
setenv PATH ${PATH}:/usr/local/mysql/bin
```

Se o arquivo de inicialização apropriado não existir no seu diretório inicial, crie-o com um editor de texto.

Depois de modificar sua configuração `PATH`, abra uma nova janela do console no Windows ou faça login novamente no Unix para que a configuração entre em vigor.
