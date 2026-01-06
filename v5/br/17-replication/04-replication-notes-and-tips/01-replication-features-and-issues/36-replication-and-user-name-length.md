#### 16.4.1.36 Replicação e comprimento do nome do usuário

O comprimento máximo dos nomes de usuário do MySQL foi aumentado de 16 caracteres para 32 caracteres no MySQL 5.7.8. A replicação de nomes de usuário com mais de 16 caracteres para uma replica que suporta apenas nomes de usuário mais curtos falha. No entanto, isso deve ocorrer apenas ao replicar de uma fonte mais recente para uma replica mais antiga, o que não é uma configuração recomendada.
