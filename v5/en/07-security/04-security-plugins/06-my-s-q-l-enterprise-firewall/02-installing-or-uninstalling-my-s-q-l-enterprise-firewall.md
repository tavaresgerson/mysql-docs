#### 6.4.6.2 Instalação ou Desinstalação do MySQL Enterprise Firewall

A instalação do MySQL Enterprise Firewall é uma operação única que instala os elementos descritos em [Section 6.4.6.1, “Elements of MySQL Enterprise Firewall”](firewall-elements.html "6.4.6.1 Elements of MySQL Enterprise Firewall"). A instalação pode ser realizada usando uma interface gráfica ou manualmente:

* No Windows, o MySQL Installer inclui uma opção para habilitar o MySQL Enterprise Firewall.

* O MySQL Workbench 6.3.4 ou superior pode instalar o MySQL Enterprise Firewall, habilitar ou desabilitar um firewall instalado ou desinstalar o firewall.

* A instalação manual do MySQL Enterprise Firewall envolve a execução de um script localizado no diretório `share` da sua instalação do MySQL.

Importante

Leia toda esta seção antes de seguir suas instruções. Partes do procedimento diferem dependendo do seu ambiente.

Nota

Se instalado, o MySQL Enterprise Firewall envolve alguma sobrecarga mínima (minimal overhead) mesmo quando desabilitado. Para evitar essa sobrecarga, não instale o firewall a menos que você planeje usá-lo.

Nota

O MySQL Enterprise Firewall não funciona em conjunto com o query cache. Se o query cache estiver habilitado, desabilite-o antes de instalar o firewall (consulte [Section 8.10.3.3, “Query Cache Configuration”](query-cache-configuration.html "8.10.3.3 Query Cache Configuration")).

Para instruções de uso, consulte [Section 6.4.6.3, “Using MySQL Enterprise Firewall”](firewall-usage.html "6.4.6.3 Using MySQL Enterprise Firewall"). Para informações de referência, consulte [Section 6.4.6.4, “MySQL Enterprise Firewall Reference”](firewall-reference.html "6.4.6.4 MySQL Enterprise Firewall Reference").

* [Instalando o MySQL Enterprise Firewall](firewall-installation.html#firewall-install "Instalando o MySQL Enterprise Firewall")
* [Desinstalando o MySQL Enterprise Firewall](firewall-installation.html#firewall-uninstall "Desinstalando o MySQL Enterprise Firewall")

##### Instalando o MySQL Enterprise Firewall

Se o MySQL Enterprise Firewall já estiver instalado a partir de uma versão mais antiga do MySQL, desinstale-o usando as instruções fornecidas posteriormente nesta seção e, em seguida, reinicie o seu server antes de instalar a versão atual. Neste caso, também é necessário registrar sua configuração novamente.

No Windows, você pode usar o MySQL Installer para instalar o MySQL Enterprise Firewall, conforme mostrado na [Figure 6.2, “Instalação do MySQL Enterprise Firewall no Windows”](firewall-installation.html#firewall-installation-windows-installer "Figure 6.2 MySQL Enterprise Firewall Installation on Windows"). Marque a caixa de seleção Enable MySQL Enterprise Firewall. (A opção Open Firewall port for network access tem um propósito diferente. Ela se refere ao Windows Firewall e controla se o Windows bloqueia a porta TCP/IP na qual o MySQL server escuta por conexões de cliente.)

**Figure 6.2 Instalação do MySQL Enterprise Firewall no Windows**

![Content is described in the surrounding text.](images/firewall-windows-installer-option.png)

Para instalar o MySQL Enterprise Firewall usando o MySQL Workbench 6.3.4 ou superior, consulte [MySQL Enterprise Firewall Interface](/doc/workbench/en/wb-mysql-firewall.html).

Para instalar o MySQL Enterprise Firewall manualmente, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no sufixo usado para se referir ao arquivo da library do plugin:

* `win_install_firewall.sql`: Escolha este script para sistemas Windows que usam `.dll` como sufixo de nome de arquivo.

* `linux_install_firewall.sql`: Escolha este script para Linux e sistemas semelhantes que usam `.so` como sufixo de nome de arquivo.

O script de instalação cria Stored Procedures no Database padrão, `mysql`. Execute o script da seguinte forma na linha de comando. O exemplo aqui usa o script de instalação para Linux. Faça as substituições apropriadas para o seu sistema.

```sql
$> mysql -u root -p < linux_install_firewall.sql
Enter password: (enter root password here)
```

Nota

A partir do MySQL 5.7.21, para uma nova instalação do MySQL Enterprise Firewall, `InnoDB` é usado em vez de `MyISAM` para as tabelas do firewall. Para upgrades para 5.7.21 ou superior de uma instalação onde o MySQL Enterprise Firewall já está instalado, é recomendado que você altere as tabelas do firewall para usar `InnoDB`:

```sql
ALTER TABLE mysql.firewall_users ENGINE=InnoDB;
ALTER TABLE mysql.firewall_whitelist ENGINE=InnoDB;
```

Nota

Para usar o MySQL Enterprise Firewall no contexto de Replication source/replica, Group Replication ou InnoDB Cluster, você deve usar o MySQL 5.7.21 ou superior e garantir que as tabelas do firewall usem `InnoDB`, conforme descrito acima. Então você deve preparar os nós replica antes de executar o script de instalação no nó source. Isto é necessário porque as declarações [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") no script não são replicadas.

1. Em cada nó replica, extraia as declarações [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") do script de instalação e execute-as manualmente.

2. No nó source, execute o script de instalação conforme descrito anteriormente.

A instalação do MySQL Enterprise Firewall, seja usando uma interface gráfica ou manualmente, deve habilitar o firewall. Para verificar isso, conecte-se ao server e execute esta declaração:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

Se o plugin falhar ao inicializar, verifique o error log do server em busca de mensagens de diagnóstico.

##### Desinstalando o MySQL Enterprise Firewall

O MySQL Enterprise Firewall pode ser desinstalado usando o MySQL Workbench ou manualmente.

Para desinstalar o MySQL Enterprise Firewall usando o MySQL Workbench 6.3.4 ou superior, consulte [MySQL Enterprise Firewall Interface](/doc/workbench/en/wb-mysql-firewall.html), em [Chapter 29, *MySQL Workbench*](workbench.html "Chapter 29 MySQL Workbench").

Para desinstalar o MySQL Enterprise Firewall manualmente, execute as seguintes declarações. As declarações usam `IF EXISTS` porque, dependendo da versão do firewall instalada anteriormente, alguns objetos podem não existir.

```sql
DROP TABLE IF EXISTS mysql.firewall_users;
DROP TABLE IF EXISTS mysql.firewall_whitelist;

UNINSTALL PLUGIN MYSQL_FIREWALL;
UNINSTALL PLUGIN MYSQL_FIREWALL_USERS;
UNINSTALL PLUGIN MYSQL_FIREWALL_WHITELIST;

DROP FUNCTION IF EXISTS mysql_firewall_flush_status;
DROP FUNCTION IF EXISTS normalize_statement;
DROP FUNCTION IF EXISTS read_firewall_users;
DROP FUNCTION IF EXISTS read_firewall_whitelist;
DROP FUNCTION IF EXISTS set_firewall_mode;

DROP PROCEDURE IF EXISTS mysql.sp_reload_firewall_rules;
DROP PROCEDURE IF EXISTS mysql.sp_set_firewall_mode;
```