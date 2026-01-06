### 6.5.1 Elementos de Máscara e Desidentificação de Dados da MySQL Enterprise

O MySQL Enterprise Data Masking and De-Identification é baseado em uma biblioteca de plugins que implementa esses elementos:

- Um plugin no lado do servidor chamado `data_masking`.
- Um conjunto de funções carregáveis fornece uma API em nível SQL para realizar operações de mascaramento e desidentificação. Algumas dessas funções exigem o privilégio `SUPER`.
