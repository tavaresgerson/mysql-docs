#### 19.5.1.38 Replicação e comprimento do nome do usuário

O comprimento máximo para nomes de usuário no MySQL 8.0 é de 32 caracteres. A replicação de nomes de usuário com mais de 16 caracteres falha quando a replica executa uma versão do MySQL anterior à 5.7, porque essas versões suportam apenas nomes de usuário mais curtos. Isso ocorre apenas quando se replica de uma fonte mais recente para uma replica mais antiga, o que não é uma configuração recomendada.
