#### 16.4.1.27 Erros de replicação durante a replicação

Se uma declaração produzir o mesmo erro (código de erro idêntico) tanto na fonte quanto na réplica, o erro será registrado, mas a replicação continuará.

Se uma instrução produzir diferentes erros na fonte e na réplica, o fio de replicação é encerrado e a réplica escreve uma mensagem em seu log de erros e aguarda que o administrador do banco de dados decida o que fazer com o erro. Isso inclui o caso em que uma instrução produz um erro na fonte ou na réplica, mas não em ambas. Para resolver o problema, conecte-se manualmente à réplica e determine a causa do problema. `SHOW SLAVE STATUS` é útil para isso. Em seguida, corrija o problema e execute `START SLAVE`. Por exemplo, você pode precisar criar uma tabela inexistente antes de poder iniciar a réplica novamente.

Nota

Se um erro temporário for registrado no log de erros da replica, você não precisa necessariamente tomar nenhuma ação sugerida na mensagem de erro citada. Erros temporários devem ser tratados quando o cliente tenta novamente a transação. Por exemplo, se o fio de SQL de replicação registrar um erro temporário relacionado a um deadlock, você não precisa reiniciar a transação manualmente na replica, a menos que o fio de SQL de replicação termine posteriormente com uma mensagem de erro não temporária.

Se esse comportamento de validação de código de erro não for desejado, alguns ou todos os erros podem ser ocultados (ignorados) com a opção [`--slave-skip-errors`]\(<https://pt.wikipedia.org/wiki/Op%C3%A9rnia_(programação)>, Replication Options Replica).

Para motores de armazenamento não transacionais, como `MyISAM`, é possível ter uma instrução que atualiza apenas parcialmente uma tabela e retorna um código de erro. Isso pode acontecer, por exemplo, em uma inserção de múltiplas linhas que tem uma linha que viola uma restrição de chave, ou se uma instrução de atualização longa for cancelada após a atualização de algumas das linhas. Se isso acontecer na fonte, a replica espera que a execução da instrução resulte no mesmo código de erro. Se não, o fio de SQL de replicação para.

Se você estiver replicando entre tabelas que usam diferentes motores de armazenamento na fonte e na replica, tenha em mente que a mesma instrução pode produzir um erro diferente quando executada contra uma versão da tabela, mas não a outra, ou pode causar um erro para uma versão da tabela, mas não para a outra. Por exemplo, como o `MyISAM` ignora as restrições de chave estrangeira, uma instrução `INSERT` ou `UPDATE` acessando uma tabela `InnoDB` na fonte pode causar uma violação de chave estrangeira, mas a mesma instrução executada em uma versão `MyISAM` da mesma tabela na replica não produziria esse erro, causando a parada da replicação.
