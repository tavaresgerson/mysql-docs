### 2.9.5 Iniciar e parar o MySQL automaticamente

Esta seção discute métodos para iniciar e parar o servidor MySQL.

Geralmente, você inicia o servidor `mysqld` de uma dessas maneiras:

- Invoque o `mysqld` diretamente. Isso funciona em qualquer plataforma.
- No Windows, você pode configurar um serviço MySQL que é executado automaticamente quando o Windows é iniciado.
- Em sistemas Unix e Unix-like, você pode invocar `mysqld_safe`, que tenta determinar as opções apropriadas para `mysqld` e, em seguida, executa-lo com essas opções.
- Em sistemas Linux que suportam systemd, você pode usá-lo para controlar o servidor.
- Em sistemas que usam diretórios de execução de estilo System V (ou seja, `/etc/init.d` e diretórios específicos de nível de execução), invoque `mysql.server`. Este script é usado principalmente na inicialização e desligamento do sistema. Ele geralmente é instalado sob o nome `mysql`. O script `mysql.server` inicia o servidor invocando `mysqld_safe`.
- No macOS, instale um demônio de lançamento para habilitar a inicialização automática do MySQL na inicialização do sistema. O demônio inicia o servidor invocando `mysqld_safe`. Para detalhes, consulte a Seção 2.4.3, Instalar e usar o Daemon de Lançamento do MySQL. Um Painel de Preferências do MySQL também fornece controle para iniciar e parar o MySQL através das Preferências do Sistema. Consulte a Seção 2.4.4, Instalar e usar o Painel de Preferências do MySQL.
- No Solaris, use o sistema de estrutura de gerenciamento de serviços (SMF) para iniciar e controlar a inicialização do MySQL.

systemd, os scripts `mysqld_safe` e `mysql.server`, o Solaris SMF e o Item de Inicialização do macOS (ou o Painel de Preferências MySQL) podem ser usados para iniciar o servidor manualmente ou automaticamente no momento da inicialização do sistema. systemd, `mysql.server`, e o Item de Inicialização também podem ser usados para parar o servidor.

A tabela a seguir mostra quais grupos de opções os scripts de inicialização e servidor lêem dos arquivos de opções.

**Tabela 2.16 MySQL Startup Scripts e Grupos de Opções de Servidor Suportados**

<table><thead><tr> <th>Escrito</th> <th>Grupos de opções</th> </tr></thead><tbody><tr> <td><span><strong>- O quê ?</strong></span></td> <td>[[<code>[mysql<code>[server]</code></code>]], [[<code>[server]</code>]], [[<code>[mysqld-<em><code>major_version</code>]]</em>]</code></td> </tr><tr> <td><span><strong>mysqld_safe</strong></span></td> <td>[[<code>[mysql<code>[server]</code></code>]], [[<code>[server]</code>]], [[<code>[mysqld_saf<code>[mysql<code>[mysql.server]</code></code></code>]]</td> </tr><tr> <td><span><strong>servidor mysql.</strong></span></td> <td>[[<code>[mysql<code>[mysql.server]</code></code>]], [[<code>[mysql.server]</code>]], [[<code>[server]</code>]]</td> </tr></tbody></table>

`[mysqld-major_version]` significa que grupos com nomes como `[mysqld-8.3]` e `[mysqld-8.4]` são lidos por servidores com versões 8.3.x, 8.4.x, e assim por diante. Este recurso pode ser usado para especificar opções que podem ser lidas apenas por servidores dentro de uma determinada série de versões.

Para compatibilidade com versões anteriores, o `mysql.server` também lê o grupo `[mysql_server]` e o `mysqld_safe` também lê o grupo `[safe_mysqld]`. Para estar atualizado, você deve atualizar seus arquivos de opções para usar os grupos `[mysql.server]` e `[mysqld_safe]`.

Para obter mais informações sobre os ficheiros de configuração do MySQL e a sua estrutura e conteúdos, ver Secção 6.2.2.2, "Utilizar ficheiros de opção".
