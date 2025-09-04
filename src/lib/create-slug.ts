export  function createSlug(name: string) {
    // Convert to lowercase
    let slug = name.toLowerCase();

    // Remove diacritics (accents)
    slug = removeDiacritics(slug);

    // Replace spaces with hyphens
    slug = slug.replace(/\s+/g, '-');

    // Remove invalid characters (only allow a-z, 0-9, and hyphen)
    slug = slug.replace(/[^a-z0-9\-]/g, '');

    // Trim hyphens from the beginning and end
    slug = slug.replace(/^[-]+|[-]+$/g, '');

    // Ensure only one hyphen between words
    slug = slug.replace(/-+/g, '-');

    return slug;
}

function removeDiacritics(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}