#### 17.9.5.4 Conselhos de Uso e Limitações da Recuperação Distribuída

A recuperação distribuída possui algumas limitações. Ela é baseada na replicação assíncrona clássica e, como tal, pode ser lenta se o servidor que está entrando no grupo não for provisionado de forma alguma ou for provisionado com uma imagem de backup muito antiga. Isso significa que, se os dados a serem transferidos forem muito grandes na fase 1, o servidor pode levar muito tempo para se recuperar. Desta forma, a recomendação é que, antes de adicionar um servidor ao grupo, ele deva ser provisionado com um *snapshot* razoavelmente recente de um servidor que já esteja no grupo. Isso minimiza a duração da fase 1 e reduz o impacto no servidor *donor*, visto que ele precisa salvar e transferir menos *binary logs*.

Warning

Recomenda-se que um servidor seja provisionado antes de ser adicionado a um grupo. Dessa forma, minimiza-se o tempo gasto na etapa de recuperação.