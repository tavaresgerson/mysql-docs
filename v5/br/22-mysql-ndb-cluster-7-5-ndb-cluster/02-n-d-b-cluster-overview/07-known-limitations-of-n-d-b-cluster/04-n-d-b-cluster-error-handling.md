#### 21.2.7.4 Tratamento de Erros no NDB Cluster

Iniciar, parar ou reiniciar um Node pode gerar erros temporários, fazendo com que algumas Transactions falhem. Esses casos incluem o seguinte:

*   **Erros temporários.** Ao iniciar um Node pela primeira vez, é possível que você veja o Error 1204 (Temporary failure, distribution changed) e erros temporários semelhantes.

*   **Erros devido à falha do Node.** A parada ou falha de qualquer Data Node pode resultar em vários erros diferentes de falha de Node. (Entretanto, não deve haver Transactions abortadas ao realizar um Shutdown planejado do Cluster.)

Em qualquer um desses casos, quaisquer Errors gerados devem ser tratados dentro da aplicação. Isso deve ser feito repetindo a Transaction.

Veja também [Seção 21.2.7.2, “Limites e Diferenças do NDB Cluster em relação aos Limites Padrão do MySQL”](mysql-cluster-limitations-limits.html "21.2.7.2 Limites e Diferenças do NDB Cluster em relação aos Limites Padrão do MySQL").