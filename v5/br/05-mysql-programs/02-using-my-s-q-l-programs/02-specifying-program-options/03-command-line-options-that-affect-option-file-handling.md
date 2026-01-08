#### 4.2.2.3 Opções de linha de comando que afetam o tratamento de arquivos com Option

A maioria dos programas do MySQL que suportam arquivos de opções lida com as seguintes opções. Como essas opções afetam o manuseio de arquivos de opções, elas devem ser fornecidas na linha de comando e não em um arquivo de opção. Para funcionar corretamente, cada uma dessas opções deve ser fornecida antes das outras, com essas exceções:

- `--print-defaults` pode ser usado imediatamente após `--defaults-file`, `--defaults-extra-file` ou `--login-path`.

- No Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, a opção `--install` deve ser a primeira. Veja a Seção 2.3.4.8, “Iniciar o MySQL como um Serviço do Windows”.

Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere metacaractere `~` do shell, pois ele pode não ser interpretado conforme o esperado.

**Tabela 4.3 Resumo do Arquivo de Opções**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>--defaults-extra-file</td>
         <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td>
      </tr>
      <tr>
         <td>--defaults-file</td>
         <td>Arquivo de opção de leitura apenas nomeado</td>
      </tr>
      <tr>
         <td>--defaults-group-suffix</td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td>--login-path</td>
         <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
      </tr>
      <tr>
         <td>--no-defaults</td>
         <td>Não ler arquivos de opção</td>
      </tr>
   </tbody>
</table>

- `--defaults-extra-file=nome_do_arquivo`

  <table>
   <tbody>
      <tr>
        <th>Formato de linha de comando</th>
        <td>[[<code>--defaults-extra-file=filename</code>]]</td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>Nome do arquivo</td>
      </tr>
      <tr>
        <th>Valor padrão</th>
        <td>[[<code>[none]</code>]]</td>
      </tr>
    </tbody>
  </table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário e (em todas as plataformas) antes do arquivo de caminho de login. (Para informações sobre a ordem em que os arquivos de opção são usados, consulte a Seção 4.2.2.2, “Usando Arquivos de Opção”.) Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Consulte a introdução desta seção sobre as restrições sobre a posição em que esta opção pode ser especificada.

- `--defaults-file=nome_do_arquivo`

  <table>
    <tbody>
      <tr>
        <th>Formato de linha de comando</th>
        <td>[[<code>--defaults-file=filename</code>]]</td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>Nome do arquivo</td>
      </tr>
      <tr>
        <th>Valor padrão</th>
        <td>[[<code>[none]</code>]]</td>
      </tr>
    </tbody>
  </table>

  Leia apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. *`file_name`* é interpretado em relação ao diretório atual se for fornecido como um nome de caminho relativo em vez de um nome de caminho completo.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Consulte a introdução desta seção sobre as restrições sobre a posição em que esta opção pode ser especificada.

- `--defaults-group-suffix=str`

  <table>
    <tbody>
      <tr>
        <th>Formato de linha de comando</th>
        <td>[[<code>--defaults-group-suffix=string</code>]]</td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>String</td>
      </tr>
      <tr>
        <th>Valor padrão</th>
        <td>[[<code>[none]</code>]]</td>
      </tr>
    </tbody>
  </table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o cliente **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

- `--login-path=nome`

  <table>
    <tbody>
      <tr>
         <th>Formato de linha de comando</th>
         <td>[[<code>--login-path=name</code>]]</td>
      </tr>
      <tr>
         <th>Tipo</th>
         <td>String</td>
      </tr>
      <tr>
         <th>Valor padrão</th>
         <td>[[<code>[none]</code>]]</td>
      </tr>
    </tbody>
  </table>

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Um programa cliente lê o grupo de opções correspondente ao caminho de login nomeado, além dos grupos de opções que o programa lê por padrão. Considere este comando:

  ```sh
  mysql --login-path=mypath
  ```

  Por padrão, o cliente **mysql** lê os grupos de opções `[client]` e `[mysql]`. Portanto, para o comando mostrado, o **mysql** lê `[client]` e `[mysql]` de outros arquivos de opções, e `[client]`, `[mysql]` e `[mypath]` do arquivo de caminho de login.

  Os programas de cliente leem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada.

  Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`.

  Consulte a introdução desta seção sobre as restrições sobre a posição em que esta opção pode ser especificada.

- `--no-defaults`

  <table>
   <tbody>
      <tr>
         <th>Formato de linha de comando</th>
         <td>[[<code>--no-defaults</code>]]</td>
      </tr>
      <tr>
         <th>Tipo</th>
         <td>Boolean</td>
      </tr>
      <tr>
         <th>Valor padrão</th>
         <td>[[<code>false</code>]]</td>
      </tr>
   </tbody>
</table>

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que os programas cliente leem o arquivo de caminho de login `.mylogin.cnf`, se ele existir, mesmo quando o `--no-defaults` é usado. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo que o `--no-defaults` esteja presente. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

- `--print-defaults`

  <table>
    <tbody>
      <tr>
        <th>Formato de linha de comando</th>
        <td>[[<code>--print-defaults</code>]]</td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>Boolean</td>
      </tr>
      <tr>
        <th>Valor padrão</th>
        <td>[[<code>false</code>]]</td>
      </tr>
    </tbody>
  </table>

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção. Os valores da senha são mascarados.

  Consulte a introdução desta seção sobre as restrições sobre a posição em que esta opção pode ser especificada.
