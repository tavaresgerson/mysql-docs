#### 6.4.6.2 Instalar ou desinstalar o Firewall Empresarial MySQL

A instalação do MySQL Enterprise Firewall é uma operação única que instala os elementos descritos em Seção 6.4.6.1, “Elementos do MySQL Enterprise Firewall”. A instalação pode ser realizada usando uma interface gráfica ou manualmente:

- No Windows, o Instalador do MySQL inclui uma opção para habilitar o Firewall Empresarial do MySQL para você.

- O MySQL Workbench 6.3.4 ou superior pode instalar o MySQL Enterprise Firewall, ativar ou desativar um firewall instalado ou desinstalar o firewall.

- A instalação manual do MySQL Enterprise Firewall envolve a execução de um script localizado no diretório `share` da sua instalação do MySQL.

Importante

Leia toda esta seção antes de seguir as instruções. Algumas partes do procedimento diferem dependendo do seu ambiente.

Nota

Se instalado, o MySQL Enterprise Firewall envolve um pequeno custo adicional, mesmo quando desativado. Para evitar esse custo adicional, não instale o firewall a menos que você planeje usá-lo.

Nota

O MySQL Enterprise Firewall não funciona com o cache de consultas. Se o cache de consultas estiver ativado, desative-o antes de instalar o firewall (consulte Seção 8.10.3.3, “Configuração do Cache de Consultas”).

Para instruções de uso, consulte Seção 6.4.6.3, “Usando o Firewall do MySQL Enterprise”. Para informações de referência, consulte Seção 6.4.6.4, “Referência do Firewall do MySQL Enterprise”.

- Instalando o Firewall do MySQL Enterprise
- Desinstalação do Firewall do MySQL Enterprise

##### Instalando o Firewall do MySQL Enterprise

Se o MySQL Enterprise Firewall já estiver instalado a partir de uma versão mais antiga do MySQL, desinstale-o usando as instruções fornecidas mais adiante nesta seção e, em seguida, reinicie o servidor antes de instalar a versão atual. Nesse caso, também é necessário registrar sua configuração novamente.

No Windows, você pode usar o Instalador do MySQL para instalar o Firewall do MySQL Enterprise, conforme mostrado na Figura 6.2, “Instalação do Firewall do MySQL Enterprise no Windows”. Marque a caixa de seleção Habilitar o Firewall do MySQL Enterprise. (A opção Abrir porta do Firewall para acesso à rede tem um propósito diferente. Refere-se ao Firewall do Windows e controla se o Windows bloqueia a porta TCP/IP na qual o servidor MySQL escuta as conexões dos clientes.)

**Figura 6.2: Instalação do Firewall Empresarial MySQL no Windows**

![O conteúdo é descrito no texto ao redor.](images/firewall-windows-installer-option.png)

Para instalar o MySQL Enterprise Firewall usando o MySQL Workbench 6.3.4 ou superior, consulte Interface do MySQL Enterprise Firewall.

Para instalar o MySQL Enterprise Firewall manualmente, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no sufixo usado para referenciar o arquivo da biblioteca de plugins:

- `win_install_firewall.sql`: Escolha este script para sistemas Windows que usam `.dll` como sufixo do nome do arquivo.

- `linux_install_firewall.sql`: Escolha este script para sistemas Linux e sistemas semelhantes que utilizam `.so` como sufixo do nome do arquivo.

O script de instalação cria procedimentos armazenados no banco de dados padrão, `mysql`. Execute o script da seguinte forma na linha de comando. O exemplo aqui usa o script de instalação do Linux. Faça as substituições apropriadas para o seu sistema.

```sql
$> mysql -u root -p < linux_install_firewall.sql
Enter password: (enter root password here)
```

Nota

A partir do MySQL 5.7.21, para uma nova instalação do MySQL Enterprise Firewall, o `InnoDB` é usado em vez do `MyISAM` para as tabelas do firewall. Para atualizações para 5.7.21 ou versões superiores de uma instalação para a qual o MySQL Enterprise Firewall já está instalado, recomenda-se alterar as tabelas do firewall para usar `InnoDB`:

```sql
ALTER TABLE mysql.firewall_users ENGINE=InnoDB;
ALTER TABLE mysql.firewall_whitelist ENGINE=InnoDB;
```

Nota

Para usar o MySQL Enterprise Firewall no contexto da replicação de origem/replica, da replicação em grupo ou do clúster InnoDB, você deve usar o MySQL 5.7.21 ou superior e garantir que as tabelas do firewall usem `InnoDB` como descrito acima. Em seguida, você deve preparar os nós da replica antes de executar o script de instalação no nó de origem. Isso é necessário porque as instruções `INSTALL PLUGIN` no script não são replicadas.

1. Em cada nó de replicação, extraia as instruções `INSTALL PLUGIN` do script de instalação e execute-as manualmente.

2. No nó de origem, execute o script de instalação conforme descrito anteriormente.

A instalação do MySQL Enterprise Firewall, seja por meio de uma interface gráfica ou manualmente, deve habilitar o firewall. Para verificar isso, conecte-se ao servidor e execute a seguinte instrução:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

##### Desinstalação do Firewall Empresarial MySQL

O MySQL Enterprise Firewall pode ser desinstalado usando o MySQL Workbench ou manualmente.

Para desinstalar o MySQL Enterprise Firewall usando o MySQL Workbench 6.3.4 ou superior, consulte MySQL Enterprise Firewall Interface, em Capítulo 29, *MySQL Workbench*.

Para desinstalar o MySQL Enterprise Firewall manualmente, execute as seguintes instruções. As instruções usam `IF EXISTS` porque, dependendo da versão do firewall instalada anteriormente, alguns objetos podem não existir.

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
