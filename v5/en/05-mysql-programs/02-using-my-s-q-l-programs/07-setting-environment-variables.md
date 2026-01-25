### 4.2.7 Configurando Variáveis de Ambiente

Variáveis de ambiente podem ser definidas no **command prompt** (prompt de comando) para afetar a invocação atual do seu processador de comandos, ou definidas permanentemente para afetar invocações futuras. Para definir uma variável permanentemente, você pode configurá-la em um arquivo de inicialização (*startup file*) ou usando a interface fornecida pelo seu sistema para essa finalidade. Consulte a documentação do seu interpretador de comandos para detalhes específicos. Seção 4.9, “Environment Variables”, lista todas as variáveis de ambiente que afetam a operação dos programas MySQL.

Para especificar um valor para uma variável de ambiente, utilize a sintaxe apropriada para o seu processador de comandos. Por exemplo, no Windows, você pode definir a variável `USER` para especificar o nome da sua conta MySQL. Para fazer isso, use esta sintaxe:

```sql
SET USER=your_name
```

A sintaxe no Unix depende do seu **shell**. Suponha que você queira especificar o número da porta TCP/IP usando a variável `MYSQL_TCP_PORT`. A sintaxe típica (como para **sh**, **ksh**, **bash**, **zsh**, e assim por diante) é a seguinte:

```sql
MYSQL_TCP_PORT=3306
export MYSQL_TCP_PORT
```

O primeiro comando define a variável, e o comando `export` exporta a variável para o ambiente do **shell** para que seu valor se torne acessível ao MySQL e a outros processos.

Para **csh** e **tcsh**, use **setenv** para disponibilizar a variável do **shell** ao ambiente:

```sql
setenv MYSQL_TCP_PORT 3306
```

Os comandos para definir variáveis de ambiente podem ser executados no seu **command prompt** para entrarem em vigor imediatamente, mas as configurações persistem apenas até você sair (fazer **log out**). Para que as configurações entrem em vigor toda vez que você fizer **login**, utilize a interface fornecida pelo seu sistema ou coloque o(s) comando(s) apropriado(s) em um arquivo de inicialização que seu interpretador de comandos lê toda vez que é iniciado.

No Windows, você pode definir variáveis de ambiente usando o Painel de Controle do Sistema (em Avançado).

No Unix, os arquivos de inicialização de **shell** típicos são `.bashrc` ou `.bash_profile` para **bash**, ou `.tcshrc` para **tcsh**.

Suponha que seus programas MySQL estejam instalados em `/usr/local/mysql/bin` e que você queira facilitar a invocação desses programas. Para fazer isso, defina o valor da variável de ambiente `PATH` para incluir esse diretório. Por exemplo, se o seu **shell** for **bash**, adicione a seguinte linha ao seu arquivo `.bashrc`:

```sql
PATH=${PATH}:/usr/local/mysql/bin
```

O **bash** utiliza diferentes arquivos de inicialização para **shells** de **login** e **nonlogin** (sem login), então você pode querer adicionar a configuração ao `.bashrc` para **shells** de **login** e ao `.bash_profile` para **shells** de **nonlogin** para garantir que o `PATH` seja definido de qualquer forma.

Se o seu **shell** for **tcsh**, adicione a seguinte linha ao seu arquivo `.tcshrc`:

```sql
setenv PATH ${PATH}:/usr/local/mysql/bin
```

Se o arquivo de inicialização apropriado não existir no seu diretório *home*, crie-o com um editor de texto.

Após modificar sua configuração de `PATH`, abra uma nova janela de console no Windows ou faça **login** novamente no Unix para que a configuração entre em vigor.