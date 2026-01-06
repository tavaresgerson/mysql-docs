#### 17.9.5.4 Recomendações de uso e limitações da recuperação distribuída

A recuperação distribuída tem algumas limitações. Ela é baseada na replicação assíncrona clássica e, como tal, pode ser lenta se o servidor que está se juntando ao grupo não estiver configurado ou estiver configurado com uma imagem de backup muito antiga. Isso significa que, se os dados a serem transferidos forem muito grandes na fase 1, o servidor pode levar muito tempo para se recuperar. Portanto, a recomendação é que, antes de adicionar um servidor ao grupo, ele deve ser configurado com um instantâneo bastante recente de um servidor já no grupo. Isso minimiza o comprimento da fase 1 e reduz o impacto no servidor doador, já que ele precisa salvar e transferir menos logs binários.

Aviso

Recomenda-se que um servidor seja provisionado antes de ser adicionado a um grupo. Dessa forma, o tempo gasto na etapa de recuperação é minimizado.
