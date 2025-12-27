## 12.5 Configurando o Conjunto de Caracteres e a Codificação da Aplicação

Para aplicações que armazenam dados usando o conjunto de caracteres e a codificação de caracteres padrão do MySQL (`utf8mb4`, `utf8mb4_0900_ai_ci`), não é necessário fazer configurações especiais. Se as aplicações exigirem armazenamento de dados usando um conjunto de caracteres ou codificação de caracteres diferente, é possível configurar as informações do conjunto de caracteres de várias maneiras:

* Especifique as configurações de caracteres por banco de dados. Por exemplo, aplicações que usam um banco de dados podem usar o padrão `utf8mb4`, enquanto aplicações que usam outro banco de dados podem usar `sjis`.

* Especifique as configurações de caracteres no início do servidor. Isso faz com que o servidor use as configurações fornecidas para todas as aplicações que não fazem outros arranjos.

* Especifique as configurações de caracteres no momento da configuração, se você compilar o MySQL a partir da fonte. Isso faz com que o servidor use as configurações fornecidas como padrões para todas as aplicações, sem precisar especificá-las no início do servidor.

Quando diferentes aplicações exigem configurações de caracteres diferentes, a técnica de per-banco de dados oferece bastante flexibilidade. Se a maioria ou todas as aplicações usar o mesmo conjunto de caracteres, especificar as configurações de caracteres no início do servidor ou no momento da configuração pode ser mais conveniente.

Para as técnicas de per-banco de dados ou início do servidor, as configurações controlam o conjunto de caracteres para armazenamento de dados. As aplicações também devem informar ao servidor qual conjunto de caracteres usar para comunicações cliente/servidor, conforme descrito nas instruções a seguir.

Os exemplos mostrados aqui assumem o uso do conjunto de caracteres `latin1` e da codificação `latin1_swedish_ci` em contextos específicos como uma alternativa aos padrões de `utf8mb4` e `utf8mb4_0900_ai_ci`.

* **Especifique as configurações de caracteres por banco de dados.** Para criar um banco de dados de modo que suas tabelas usem um conjunto de caracteres padrão e uma concordância padrão para armazenamento de dados, use uma instrução `CREATE DATABASE` assim:

  ```
  CREATE DATABASE mydb
    CHARACTER SET latin1
    COLLATE latin1_swedish_ci;
  ```

  As tabelas criadas no banco de dados usam `latin1` e `latin1_swedish_ci` por padrão para quaisquer colunas de caracteres.

  As aplicações que usam o banco de dados também devem configurar sua conexão com o servidor cada vez que se conectam. Isso pode ser feito executando uma instrução `SET NAMES 'latin1'` após a conexão. A instrução pode ser usada independentemente do método de conexão (o cliente **mysql**, scripts PHP, etc.).

  Em alguns casos, pode ser possível configurar a conexão para usar o conjunto de caracteres desejado de outra maneira. Por exemplo, para se conectar usando **mysql**, você pode especificar a opção de linha de comando `--default-character-set=latin1` para obter o mesmo efeito que `SET NAMES 'latin1'`.

  Para mais informações sobre a configuração de conexões de clientes, consulte a Seção 12.4, “Conjunto de caracteres de conexão e concordâncias”.

  Nota

  Se você usar `ALTER DATABASE` para alterar o conjunto de caracteres padrão ou concordância do banco de dados, as rotinas armazenadas existentes no banco de dados que usam esses padrões devem ser excluídas e recriadas para que usem os novos padrões. (Em uma rotina armazenada, variáveis com tipos de dados de caracteres usam os padrões do banco de dados se o conjunto de caracteres ou concordância não forem especificados explicitamente. Veja a Seção 15.1.21, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

Esses ajustes são aplicados em todo o servidor e são os padrões para bancos de dados criados por qualquer aplicativo e para tabelas criadas nesses bancos de dados.

Ainda é necessário que os aplicativos configurem sua conexão usando `SET NAMES` ou uma opção equivalente após se conectarem, conforme descrito anteriormente. Você pode ser tentado a iniciar o servidor com a opção `--init_connect="SET NAMES 'latin1'"` para fazer com que `SET NAMES` seja executado automaticamente para cada cliente que se conecta. No entanto, isso pode resultar em resultados inconsistentes, pois o valor `init_connect` não é executado para usuários que têm o privilégio `CONNECTION_ADMIN` (ou o desatualizado privilégio `SUPER`).

* **Especifique configurações de caracteres no momento da configuração do MySQL.** Para selecionar um conjunto de caracteres e uma collation se você configurar e compilar o MySQL a partir do código-fonte, use as opções `DEFAULT_CHARSET` e `DEFAULT_COLLATION` do **CMake**:

  ```
  [mysqld]
  character-set-server=latin1
  collation-server=latin1_swedish_ci
  ```

  O servidor resultante usa `latin1` e `latin1_swedish_ci` como padrão para bancos de dados e tabelas e para conexões de clientes. Não é necessário usar `--character-set-server` e `--collation-server` para especificar esses padrões no momento do início do servidor. Também não é necessário que os aplicativos configurem sua conexão usando `SET NAMES` ou uma opção equivalente após se conectarem ao servidor.

Independentemente de como você configure o conjunto de caracteres MySQL para uso de aplicativos, você também deve considerar o ambiente em que esses aplicativos são executados. Por exemplo, se você pretende enviar instruções usando texto UTF-8 extraído de um arquivo que você criar em um editor, você deve editar o arquivo com o idioma do seu ambiente configurado para UTF-8 para que o arquivo seja codificado corretamente e para que o sistema operacional o trate corretamente. Se você usar o cliente **mysql** dentro de uma janela de terminal, a janela deve ser configurada para usar UTF-8, caso contrário, os caracteres podem não ser exibidos corretamente. Para um script que é executado em um ambiente web, o script deve lidar corretamente com a codificação de caracteres para sua interação com o servidor MySQL e deve gerar páginas que indiquem corretamente a codificação para que os navegadores saibam como exibir o conteúdo das páginas. Por exemplo, você pode incluir esta tag `<meta>` dentro do seu elemento `<head>`:

```
  cmake . -DDEFAULT_CHARSET=latin1 \
    -DDEFAULT_COLLATION=latin1_swedish_ci
  ```