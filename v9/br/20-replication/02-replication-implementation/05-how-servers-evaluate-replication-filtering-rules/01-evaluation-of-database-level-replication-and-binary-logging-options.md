#### 19.2.5.1 Avaliação das Opções de Replicação e Registro Binário de Nível de Banco de Dados

Ao avaliar as opções de replicação, a replica começa verificando se existem quaisquer opções `--replicate-do-db` ou `--replicate-ignore-db` que se aplicam. Ao usar `--binlog-do-db` ou `--binlog-ignore-db`, o processo é semelhante, mas as opções são verificadas na fonte.

O banco de dados que é verificado para uma correspondência depende do formato do log binário da declaração que está sendo tratada. Se a declaração foi registrada usando o formato de linha, o banco de dados onde os dados devem ser alterados é o banco de dados que é verificado. Se a declaração foi registrada usando o formato de declaração, o banco de dados padrão (especificado com uma declaração `USE`) é o banco de dados que é verificado.

Nota

Somente as declarações DML podem ser registradas usando o formato de linha. As declarações DDL são sempre registradas como declarações, mesmo quando `binlog_format=ROW`. Portanto, todas as declarações DDL são sempre filtradas de acordo com as regras para replicação baseada em declarações. Isso significa que você deve selecionar explicitamente o banco de dados padrão com uma declaração `USE` para que uma declaração DDL seja aplicada.

Para a replicação, os passos envolvidos estão listados aqui:

1. Qual formato de registro é usado?

   * **DECLARAÇÃO.** Teste o banco de dados padrão.

   * **LINHA.** Teste o banco de dados afetado pelas alterações.

2. Existem quaisquer opções `--replicate-do-db`?

   * **Sim.** A declaração do banco de dados corresponde a alguma delas?

     + **Sim.** Continue para o Passo 4.

     + **Não.** Ignore a atualização e saia.

   * **Não.** Continue para o passo 3.

3. Existem quaisquer opções `--replicate-ignore-db`?

   * **Sim.** A declaração do banco de dados corresponde a alguma delas?

     + **Sim.** Ignore a atualização e saia.

     + **Não.** Continue para o Passo 4.

   * **Não.** Continue para o Passo 4.

4. Prossiga para verificar as opções de replicação de nível de tabela, se houver alguma. Para uma descrição de como essas opções são verificadas, consulte a Seção 19.2.5.2, “Avaliação das Opções de Replicação de Nível de Tabela”.

   Importante

   Uma declaração que ainda é permitida nesta etapa não é executada ainda. A declaração não é executada até que todas as opções de nível de tabela (se houver) também tenham sido verificadas, e o resultado desse processo permita a execução da declaração.

Para o registro binário, os passos envolvidos estão listados aqui:

1. Há alguma opção `--binlog-do-db` ou `--binlog-ignore-db`?

   * **Sim.** Continue para o passo 2.

   * **Não.** Registre a declaração e saia.

2. Há um banco de dados padrão (algum banco de dados foi selecionado pelo `USE`)?

   * **Sim.** Continue para o passo 3.

   * **Não.** Ignore a declaração e saia.

3. Há um banco de dados padrão. Há alguma opção `--binlog-do-db`?

   * **Sim.** Alguma delas corresponde ao banco de dados?

     + **Sim.** Registre a declaração e saia.

     + **Não.** Ignore a declaração e saia.

   * **Não.** Continue para o passo 4.

4. Algumas das opções `--binlog-ignore-db` correspondem ao banco de dados?

   * **Sim.** Ignore a declaração e saia.

   * **Não.** Registre a declaração e saia.

Importante

Para o registro baseado em declarações, uma exceção é feita nas regras fornecidas anteriormente para as declarações `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. Nesses casos, o banco de dados sendo *criado, alterado ou excluído* substitui o banco de dados padrão ao determinar se a atualização deve ser registrada ou ignorada.

`--binlog-do-db` pode, por vezes, significar “ignorar outros bancos de dados”. Por exemplo, ao usar o registro baseado em declarações, um servidor que roda com apenas `--binlog-do-db=sales` não escreve as declarações do log binário para as quais o banco de dados padrão difere de `sales`. Ao usar o registro baseado em linhas com a mesma opção, o servidor registra apenas as atualizações que alteram dados em `sales`.