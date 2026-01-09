### 25.5.30 ndb_top — Ver informações de uso da CPU para threads do NDB

O **ndb_top** exibe informações em execução no terminal sobre o uso da CPU por threads do NDB em um nó de dados do NDB Cluster. Cada thread é representado por duas linhas no resultado, a primeira mostrando estatísticas do sistema e a segunda mostrando as estatísticas medidas para o thread.

O **ndb_top** está disponível a partir do MySQL NDB Cluster 7.6.3.

#### Uso

```
ndb_top [-h hostname] [-t port] [-u user] [-p pass] [-n node_id]
```

O **ndb_top** se conecta a um servidor MySQL que está rodando como um nó SQL do cluster. Por padrão, ele tenta se conectar a um **mysqld** rodando em `localhost` e na porta 3306, como o usuário `root` do MySQL sem senha especificada. Você pode substituir o host e a porta padrão usando, respectivamente, as opções `--host` (`-h`) e `--port` (`-t`). Para especificar um usuário e senha do MySQL, use as opções `--user` (`-u`) e `--passwd` (`-p`). Esse usuário deve ser capaz de ler tabelas no banco de dados `ndbinfo` (o **ndb_top** usa informações do `ndbinfo.cpustat` e tabelas relacionadas).

Para obter mais informações sobre contas e senhas do MySQL, consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”.

O resultado está disponível como texto simples ou um gráfico ASCII; você pode especificar isso usando as opções `--text` (`-x`) e `--graph` (`-g`), respectivamente. Esses dois modos de exibição fornecem as mesmas informações; eles podem ser usados simultaneamente. Pelo menos um modo de exibição deve estar em uso.

A exibição colorida do gráfico é suportada e ativada por padrão (`opção `--color` ou `-c`). Com o suporte à cor ativado, a exibição do gráfico mostra o tempo de uso do usuário do sistema operacional em azul, o tempo do sistema operacional em verde e o tempo de inatividade como espaço em branco. Para a carga medida, o azul é usado para o tempo de execução, o amarelo para o tempo de envio, o vermelho para o tempo gasto em espera de buffer de envio cheio e espaços em branco para o tempo de inatividade. A porcentagem exibida na exibição do gráfico é a soma das porcentagens de todos os threads que não estão inativos. As cores atualmente não são configuráveis; você pode usar escala de cinza ao invés disso usando `--skip-color`.

A visualização ordenada (`--sort`, `-r`) é baseada no máximo da carga medida e da carga relatada pelo sistema operacional. A exibição desses valores pode ser ativada e desativada usando as opções `--measured-load` (`-m`) e `--os-load` (`-o`). A exibição de pelo menos um desses carregamentos deve ser ativada.

O programa tenta obter estatísticas de um nó de dados com o ID de nó fornecido pela opção `--node-id` (`-n`); se não especificado, este é 1. **ndb_top** não pode fornecer informações sobre outros tipos de nós.

A visualização ajusta-se à altura e largura da janela do terminal; a largura mínima suportada é de 76 caracteres.

Uma vez iniciado, **ndb_top** funciona continuamente até ser forçado a sair; você pode encerrar o programa usando `Ctrl-C`. A exibição é atualizada uma vez por segundo; para definir um intervalo de atraso diferente, use `--sleep-time` (`-s`).

Nota

**ndb_top** está disponível no macOS, Linux e Solaris. Não é atualmente suportado em plataformas Windows.

A tabela a seguir inclui todas as opções específicas do programa do NDB Cluster **ndb_top**. Descrições adicionais seguem a tabela.

#### Opções Adicionais

* `--color`, `-c`

<table frame="box" rules="all" summary="Propriedades para formatação de linha de comando">
  <tr><th>Formato de Linha de Comando</th> <td><code>--color</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr>
</table>

  Mostrar gráficos ASCII em cores; desative com `--skip-colors`.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file">
    <tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr>
  </table>

  Ler o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file">
    <tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=caminho</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr>
  </table>

  Ler as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix">
    <tr><th>Formato de Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr>
  </table>

  Também ler grupos com concatenação(grupo, sufixo).

* `--graph`, `-g`

<table frame="box" rules="all" summary="Propriedades para gráfico">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--graph</code></td>
  </tr>
</table>

  Exiba dados usando gráficos; use `--skip-graphs` para desativá-lo. Esta opção ou `--text` deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  Mostre informações de uso do programa.

* [`--host`=*`nome`]* , `-h`

  <table frame="box" rules="all" summary="Propriedades para host">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--host=string</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>localhost</code></td>
    </tr>
  </table>

  Nome do host ou endereço IP do servidor MySQL para se conectar.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para login-path">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--login-path=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>[nenhum]</code></td>
    </tr>
  </table>

  Leia o caminho fornecido a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para no-login-paths">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--no-login-paths</code></td>
    </tr>
  </table>

  Ignora a leitura de opções a partir do arquivo de caminho de login.
```

Este é o texto traduzido para o português brasileiro. Se precisar de mais ajuda ou tiver alguma dúvida, sinta-se à vontade para perguntar!

* `--load-medido`, `-m`

  <table frame="box" rules="all" summary="Propriedades para load-medido"><tr><th>Formato de Linha de Comando</th> <td><code>--load-medido</code></td> </tr></table>

  Mostrar o carregamento medido por thread. Esta opção ou `--load-medido` deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></table>

  Não ler opções padrão de nenhum arquivo de opção além do arquivo de login.

* [`--node-id`=*`#`]*`, `-n`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></table>

  Monitorar o nó de dados que tem este ID de nó.

* `--load-medido`, `-o`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></table>

  Mostrar o carregamento medido pelo sistema operacional. Esta opção ou `--load-medido` deve ser verdadeira; ambas as opções podem ser verdadeiras.

* [`--password`=*`senha`]*`, `-p`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Conecte-se a um servidor MySQL usando esta senha e o usuário MySQL especificado por `--user`.

  Esta senha está associada apenas a uma conta de usuário MySQL e não está relacionada de nenhuma forma à senha usada com backups `NDB` criptografados.

* [`--port`=*`#`]*`, `-P`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Número de porta a ser usado ao se conectar ao servidor MySQL.

  (Anteriormente, a forma abreviada desta opção era `-t`, que foi reaproveitada como a forma abreviada de `--text`.)

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Imprimir a lista de argumentos do programa e sair.

* [`--sleep-time`=*`segundos`]*`, `-s`

Tempo de espera entre os refrescos da exibição, em segundos.

* `--socket=caminho/para/arquivo`, `-S`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Use o arquivo de socket especificado para a conexão.

* `--sort`, `-r`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Ordenar os tópicos por uso; desative com `--skip-sort`.

* `--text`, `-t`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

Exiba dados usando texto. Esta opção ou `--graph` deve ser verdadeira; ambas as opções podem ser verdadeiras.

(A forma abreviada desta opção era `-x` nas versões anteriores do NDB Cluster, mas isso não é mais suportado.)

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* [`--user`=*`nome`]*`, `-u`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Conecte-se como este usuário do MySQL. Normalmente, requer uma senha fornecida pela opção `--password`.

**Saída de exemplo.** A figura a seguir mostra o **ndb_top** em execução em uma janela de terminal em um sistema Linux com um nó de dados **ndbmtd** sob uma carga moderada. Aqui, o programa foi invocado usando **ndb_top** `-n8` `-x` para fornecer saída de texto e gráfico:

**Figura 25.5 ndb_top em execução em uma janela de terminal**

![Exibição de ndb_top, em execução em uma janela de terminal. Mostra informações para cada nó, incluindo os recursos utilizados.](images/ndb-top-1.png)

O **ndb_top** também mostra os tempos de espera dos threads, exibidos em verde.