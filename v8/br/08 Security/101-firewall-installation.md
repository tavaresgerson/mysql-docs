#### 8.4.7.2 Instalando ou Desinstalando o Firewall Empresarial do MySQL

A instalação do Firewall Empresarial do MySQL é uma operação única que instala os elementos descritos na Seção 8.4.7.1, “Elementos do Firewall Empresarial do MySQL”. A instalação pode ser realizada usando uma interface gráfica ou manualmente:

* No Windows, o MySQL Configurator inclui uma opção para habilitar o Firewall Empresarial do MySQL para você.
* O MySQL Workbench 6.3.4 ou superior pode instalar o Firewall Empresarial do MySQL, habilitar ou desabilitar um firewall instalado ou desinstalar o firewall.
* A instalação manual do Firewall Empresarial do MySQL envolve a execução de um script localizado no diretório `share` da sua instalação do MySQL. Importante

Leia toda esta seção antes de seguir suas instruções. Parte do procedimento difere dependendo do seu ambiente.

::: info Nota

Se instalado, o Firewall Empresarial do MySQL envolve um mínimo de overhead mesmo quando desativado. Para evitar esse overhead, não instale o firewall a menos que planeje usá-lo.

:::

Para instruções de uso, consulte a Seção 8.4.7.3, “Usando o Firewall Empresarial do MySQL”. Para informações de referência, consulte a Seção 8.4.7.4, “Referência do Firewall Empresarial do MySQL”.

* Instalando o Firewall Empresarial do MySQL
* Desinstalando o Firewall Empresarial do MySQL

##### Instalando o Firewall Empresarial do MySQL

Se o Firewall Empresarial do MySQL já estiver instalado a partir de uma versão mais antiga do MySQL, desinstale-o usando as instruções fornecidas mais adiante nesta seção e reinicie seu servidor antes de instalar a versão atual. Neste caso, também é necessário registrar sua configuração novamente.

No Windows, você pode usar a Seção 2.3.2, “Configuração: Usando o MySQL Configurator” para instalar o Firewall Empresarial do MySQL, marcando a caixa Habilitar Firewall Empresarial do MySQL na guia “Tipo e Rede”. (A abertura da porta do Firewall para acesso à rede tem um propósito diferente. Refere-se ao Firewall do Windows e controla se o Windows bloqueia a porta TCP/IP na qual o servidor MySQL escuta conexões de clientes.)

Para instalar o MySQL Enterprise Firewall usando o MySQL Workbench, consulte a Interface do MySQL Enterprise Firewall.

Para instalar o MySQL Enterprise Firewall manualmente, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no nome do arquivo usado para referenciar o script:

* `win_install_firewall.sql`
* `linux_install_firewall.sql`

O script de instalação cria procedimentos armazenados e tabelas no banco de dados do firewall que você especificar ao executar o script. O banco de dados do sistema `mysql` é a opção de armazenamento tradicional, no entanto, é preferível que você crie e use um esquema personalizado para esse propósito.

Para usar o banco de dados do sistema `mysql`, execute o script da seguinte forma a partir da linha de comando. O exemplo aqui usa o script de instalação do Linux. Faça as substituições apropriadas para o seu sistema.

```
$> mysql -u root -p -D mysql < linux_install_firewall.sql
Enter password: (enter root password here)
```

Para criar e usar um esquema personalizado com o script, faça o seguinte:

1. Inicie o servidor com a opção `--loose-mysql-firewall-database=database-name`. Insira o nome do esquema personalizado a ser usado como o banco de dados do firewall.

Ao prefixar a opção com `--loose`, o programa não emite um erro e sai, mas em vez disso, emite apenas uma mensagem de aviso.
2. Inicie o programa cliente MySQL e crie o esquema personalizado no servidor.

```
   mysql> CREATE DATABASE IF NOT EXISTS database-name;
   ```
3. Execute o script, nomeando o esquema personalizado como o banco de dados do MySQL Enterprise Firewall.

```
   $> mysql -u root -p -D database-name < linux_install_firewall.sql
   Enter password: (enter root password here)
   ```

Instalar o MySQL Enterprise Firewall usando uma interface gráfica ou manualmente deve habilitar o firewall. Para verificar isso, conecte-se ao servidor e execute a seguinte instrução:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

Se o plugin não conseguir inicializar, verifique o log de erro do servidor para mensagens de diagnóstico.

::: info Nota

Para usar o MySQL Enterprise Firewall no contexto da replicação de origem/replica, da Replicação em Grupo ou do Cluster InnoDB, você deve preparar os nós da replica antes de executar o script de instalação no nó de origem. Isso é necessário porque as instruções `INSTALL PLUGIN` no script não são replicadas.

1. Em cada nó da replica, extraia as instruções `INSTALL PLUGIN` do script de instalação e execute-as manualmente.
2. No nó de origem, execute o script de instalação conforme descrito anteriormente.

:::

##### Desinstalando o MySQL Enterprise Firewall

O MySQL Enterprise Firewall pode ser desinstalado usando o MySQL Workbench ou manualmente.

Para desinstalar o MySQL Enterprise Firewall usando o MySQL Workbench 6.3.4 ou superior, consulte a Interface do MySQL Enterprise Firewall, no Capítulo 33, *MySQL Workbench*.

Para desinstalar o MySQL Enterprise Firewall na linha de comando, execute o script de desinstalação localizado no diretório `share` da sua instalação do MySQL. O exemplo aqui especifica o banco de dados do sistema, `mysql`.

```
$> mysql -u root -p -D mysql < uninstall_firewall.sql
Enter password: (enter root password here)
```

Se você criou um esquema personalizado ao instalar o MySQL Enterprise Firewall, faça a substituição apropriada para o seu sistema.

```
$> mysql -u root -p -D database-name < uninstall_firewall.sql
Enter password: (enter root password here)
```

Este script remove os plugins, tabelas, funções e procedimentos armazenados do MySQL Enterprise Firewall.