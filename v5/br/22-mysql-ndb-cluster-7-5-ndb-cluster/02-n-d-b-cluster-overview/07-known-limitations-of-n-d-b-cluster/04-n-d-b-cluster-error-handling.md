#### 21.2.7.4 Gerenciamento de Erros do Agrupamento NDB

Iniciar, parar ou reiniciar um nó pode gerar erros temporários que causam o fracasso de algumas transações. Esses casos incluem os seguintes:

- **Erros temporários.** Ao iniciar um nó pela primeira vez, é possível que você veja o erro 1204 Falha temporária, distribuição alterada e outros erros temporários semelhantes.

- **Erros devido à falha do nó.** A parada ou falha de qualquer nó de dados pode resultar em vários tipos de erros de falha de nó. (No entanto, não deve haver transações abortadas ao realizar uma parada planejada do clúster.)

Em qualquer um desses casos, quaisquer erros gerados devem ser tratados dentro da aplicação. Isso deve ser feito tentando novamente a transação.

Veja também Seção 21.2.7.2, “Limites e Diferenças do NDB Cluster em Relação aos Limites Padrão do MySQL”.
