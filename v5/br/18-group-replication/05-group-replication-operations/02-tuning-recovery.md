### 17.5.2 Recuperação de sintonização

Sempre que um novo membro se junta a um grupo de replicação, ele se conecta a um doador adequado e recupera os dados que ele havia perdido até o ponto em que é declarado online. Esse componente crítico na Replicação em Grupo é tolerante a falhas e configurável. A seção a seguir explica como funciona a recuperação e como ajustar as configurações

#### Seleção do doador

Um doador aleatório é selecionado entre os membros online existentes no grupo. Dessa forma, há uma boa chance de que o mesmo servidor não seja selecionado mais de uma vez quando vários membros entrarem no grupo.

Se a conexão com o doador selecionado falhar, uma nova conexão será automaticamente tentada com um novo candidato doador. Quando o limite de tentativas de conexão for atingido, o procedimento de recuperação será encerrado com um erro.

Nota

Um doador é escolhido aleatoriamente da lista de membros online na visualização atual.

#### Aumento da transição automática de doadores

O outro ponto principal de preocupação na recuperação como um todo é garantir que ela lidere com falhas. Portanto, o Grupo de Replicação oferece mecanismos robustos de detecção de erros. Em versões anteriores do Grupo de Replicação, ao tentar acessar um doador, a recuperação só conseguia detectar erros de conexão devido a problemas de autenticação ou algum outro problema. A reação a esses cenários problemáticos era mudar para um novo doador, fazendo uma nova tentativa de conexão com um membro diferente.

Esse comportamento foi estendido para cobrir outros cenários de falha:

- *Cenários de dados excluídos* - Se o doador selecionado contiver alguns dados excluídos que são necessários para o processo de recuperação, ocorrerá um erro. A recuperação detecta esse erro e um novo doador é selecionado.

- *Dados duplicados* - Se um servidor que está se juntando ao grupo já contém alguns dados que entram em conflito com os dados do doador selecionado durante a recuperação, então ocorre um erro. Isso pode ser causado por algumas transações errôneas presentes no servidor que está se juntando ao grupo.

  Poder-se-ia argumentar que a recuperação deve falhar em vez de ser feita com outro doador, mas em grupos heterogêneos há a chance de outros membros compartilharem as transações conflitantes e outros não. Por essa razão, em caso de erro, a recuperação seleciona outro doador do grupo.

- *Outros erros* - Se algum dos fios de recuperação falhar (fios do receptor ou do aplicador falharem), um erro ocorrerá e a recuperação será transferida para um novo doador.

Nota

Em caso de falhas persistentes ou até mesmo transitórias, a recuperação tentará automaticamente reconectar ao mesmo ou a um novo doador.

#### Tentações de conexão do doador

A transferência de dados de recuperação depende do log binário e do framework de replicação existente do MySQL, portanto, é possível que alguns erros transitórios possam causar erros nos threads do receptor ou do aplicável. Nesses casos, o processo de transição do doador possui uma funcionalidade de tentativa novamente, semelhante à encontrada na replicação regular.

#### Número de tentativas

O número de tentativas que um servidor faz ao tentar se conectar a um doador do pool de doadores é de 10. Isso é configurado através da variável do plugin `group_replication_recovery_retry_count`. O seguinte comando define o número máximo de tentativas para se conectar a um doador em 10.

```sql
mysql> SET GLOBAL group_replication_recovery_retry_count= 10;
```

Observe que isso representa o número global de tentativas que o servidor que está se juntando ao grupo faz para se conectar a cada um dos doadores adequados.

#### Rotinas de sono

A variável do plugin `group_replication_recovery_reconnect_interval` define quanto tempo o processo de recuperação deve esperar entre as tentativas de conexão do doador. Essa variável tem seu valor padrão definido em 60 segundos e você pode alterar esse valor dinamicamente. O seguinte comando define o intervalo de tentativa de conexão do doador de recuperação para 120 segundos.

```sql
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Observe, no entanto, que a recuperação não fica em repouso após cada tentativa de conexão com um dador. Como o servidor que está se conectando ao grupo está se conectando a servidores diferentes e não ao mesmo deles repetidamente, ele pode assumir que o problema que afeta o servidor A não afeta o servidor B. Assim, a recuperação só é suspensa quando ela passou por todos os possíveis dadores. Uma vez que o servidor que está se conectando ao grupo tentou se conectar a todos os dadores adequados no grupo e nenhum deles permanece, o processo de recuperação fica em repouso por um número de segundos configurado pela variável `group_replication_recovery_reconnect_interval`.
