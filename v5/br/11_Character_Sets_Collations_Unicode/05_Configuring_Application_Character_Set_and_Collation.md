## 10.5 Configurando o Conjunto de Caracteres e a Colaboração do Aplicativo

Para aplicações que armazenam dados usando o conjunto de caracteres e a correção de texto padrão do MySQL (`latin1`, `latin1_swedish_ci`), não é necessário realizar nenhuma configuração especial. Se as aplicações exigem armazenamento de dados usando um conjunto de caracteres ou correção de texto diferente, você pode configurar as informações do conjunto de caracteres de várias maneiras:

* Especifique as configurações de caracteres por banco de dados. Por exemplo, aplicativos que usam um banco de dados podem usar o padrão `latin1`, enquanto aplicativos que usam outro banco de dados podem usar `sjis`.

* Especifique as configurações de caracteres no início do servidor. Isso faz com que o servidor use as configurações fornecidas para todas as aplicações que não fazem outros arranjos.

* Especifique as configurações de caracteres no momento da configuração, se você construir o MySQL a partir de fonte. Isso faz com que o servidor use as configurações fornecidas como padrão para todas as aplicações, sem precisar especificá-las na inicialização do servidor.

Quando diferentes aplicativos exigem diferentes configurações de caracteres, a técnica por banco de dados oferece uma boa flexibilidade. Se a maioria ou todos os aplicativos usam o mesmo conjunto de caracteres, especificar as configurações de caracteres no início do servidor ou no momento da configuração pode ser mais conveniente.

Para as técnicas de per-database ou de inicialização do servidor, as configurações controlam o conjunto de caracteres para armazenamento de dados. As aplicações também devem informar ao servidor qual conjunto de caracteres usar para comunicações cliente/servidor, conforme descrito nas instruções a seguir.

Os exemplos mostrados aqui assumem o uso do conjunto de caracteres `utf8` e da ordenação `utf8_general_ci` em contextos específicos como uma alternativa aos padrões de `latin1` e `latin1_swedish_ci`.

* **Especifique as configurações de caracteres por banco de dados.** Para criar um banco de dados de modo que suas tabelas utilizem um conjunto de caracteres padrão e uma correção de dados para armazenamento de dados, use uma declaração `CREATE DATABASE` como esta:

  ```sql
  CREATE DATABASE mydb
    CHARACTER SET utf8
    COLLATE utf8_general_ci;
  ```

As tabelas criadas no banco de dados usam `utf8` e `utf8_general_ci` por padrão para qualquer coluna de caracteres.

As aplicações que utilizam o banco de dados também devem configurar sua conexão com o servidor a cada vez que se conectam. Isso pode ser feito executando uma declaração `SET NAMES 'utf8'` após a conexão. A declaração pode ser usada independentemente do método de conexão (o cliente **mysql**, scripts PHP, etc.).

Em alguns casos, pode ser possível configurar a conexão para usar o conjunto de caracteres desejado de outra maneira. Por exemplo, para se conectar usando **mysql**, você pode especificar a opção de string de comando `--default-character-set=utf8` para obter o mesmo efeito que `SET NAMES 'utf8'`.

Para obter mais informações sobre a configuração das conexões do cliente, consulte a Seção 10.4, “Conjunto de caracteres de conexão e codificações”.

Nota

Se você usar `ALTER DATABASE` para alterar o conjunto de caracteres ou a correção padrão do banco de dados, as rotinas armazenadas existentes no banco de dados que utilizam esses padrões devem ser excluídas e recriadas para que utilizem os novos padrões. (Em uma rotina armazenada, as variáveis com tipos de dados de caracteres utilizam os padrões do banco de dados se o conjunto de caracteres ou a correção não forem especificados explicitamente. Veja a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”).

* **Especifique as configurações de caracteres no início do servidor.** Para selecionar um conjunto de caracteres e uma codificação no início do servidor, use as opções `--character-set-server` e `--collation-server`. Por exemplo, para especificar as opções em um arquivo de opções, inclua essas strings:

  ```sql
  [mysqld]
  character-set-server=utf8
  collation-server=utf8_general_ci
  ```

Esses ajustes são aplicados em todo o servidor e são os padrões para bancos de dados criados por qualquer aplicativo e para tabelas criadas nesses bancos de dados.

Ainda é necessário que as aplicações configurem sua conexão usando `SET NAMES` ou equivalente após se conectarem, conforme descrito anteriormente. Você pode ser tentado a iniciar o servidor com a opção `--init_connect="SET NAMES 'utf8'"` (server-system-variables.html#sysvar_init_connect) para fazer com que `SET NAMES` (set-names.html "13.7.4.3 SET NAMES Statement") seja executado automaticamente para cada cliente que se conecta. No entanto, isso pode resultar em resultados inconsistentes, pois o valor `init_connect` não é executado para usuários que têm o privilégio `SUPER`.

* **Especifique as configurações de caracteres no momento da configuração do MySQL.** Para selecionar um conjunto de caracteres e uma codificação se você configurar e construir o MySQL a partir do código-fonte, use as opções `DEFAULT_CHARSET` e `DEFAULT_COLLATION` do **CMake**:

  ```sql
  cmake . -DDEFAULT_CHARSET=utf8 \
    -DDEFAULT_COLLATION=utf8_general_ci
  ```

O servidor resultante utiliza `utf8` e `utf8_general_ci` como padrão para bancos de dados e tabelas e para conexões de clientes. Não é necessário usar `--character-set-server` e `--collation-server` para especificar esses padrões no início do servidor. Também não é necessário que as aplicações configurem suas conexões usando `SET NAMES` ou equivalente após se conectarem ao servidor.

Independentemente de como você configure o conjunto de caracteres MySQL para uso de aplicativos, você também deve considerar o ambiente no qual esses aplicativos são executados. Por exemplo, se você enviar declarações usando texto UTF-8 extraído de um arquivo que você cria em um editor, você deve editar o arquivo com o idioma do seu ambiente configurado para UTF-8 para que o codificação do arquivo seja correta e para que o sistema operacional o trate corretamente. Se você usar o cliente **mysql** dentro de uma janela de terminal, a janela deve ser configurada para usar UTF-8, ou os caracteres podem não ser exibidos corretamente. Para um script que é executado em um ambiente web, o script deve lidar corretamente com a codificação de caracteres para sua interação com o servidor MySQL, e deve gerar páginas que indiquem corretamente a codificação para que os navegadores saibam como exibir o conteúdo das páginas. Por exemplo, você pode incluir este `<meta>` tag dentro do seu elemento `<head>`:

```sql
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
```